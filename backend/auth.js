const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);

async function authenticateUser(req, res, next) {
    try {
        const authorization =
            req.headers.authorization || "";

        if (!authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const token =
            authorization.replace("Bearer ", "");

        const {
            data: { user },
            error
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                error: "Invalid or expired authentication token"
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(
            "Authentication error:",
            error
        );

        return res.status(401).json({
            error: "Authentication failed"
        });
    }
}

module.exports = authenticateUser;
