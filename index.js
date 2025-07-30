const { PrismaClient } = require("./prisma/prisma")
const fastify = require("fastify")({
    logger: true,

});

const db = new PrismaClient();

fastify.get("/news/all", async function (request, reply) {
    try {
        const data = await db.news.findMany();
        reply.send({ data });
    } catch (e) {
        fastify.log.error(e);
        reply.status(500).send({ error: "Database error" });
    }
});
fastify.get("/logs/all", async function (request, reply) {
    try {
        const data = await db.logs.findMany();
        reply.send({ data });
    } catch (e) {
        fastify.log.error(e);
        reply.status(500).send({ error: "Database error" });
    }
});
fastify.get("/news/:id", async function (request, reply) {
    const id = Number(request.params.id);
    try {
        if (!id) {
            reply.send({ error: "ID was not valid, could not be converted to number object. What are you doing?"});
        } else {
            const data = await db.news.findFirst({
                where: { id }
            });
            reply.send({ data });
        }
        
    } catch (e) {
        fastify.log.error(e);
        reply.status(500).send({ error: "Database error" });
    }
});
fastify.get("/logs/:now", async function (request, reply) {
    const now = Number(request.params.now);
    fastify.log.info("Date recieved:", now);
    const baseDate = new Date(now);
    const start = new Date(baseDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(baseDate);
    end.setUTCHours(29, 59, 59, 999);

    try {
        if (!start || !end) {
            reply.send({ error: "Date send in UTC seconds was invalid."});
        } else {
            const data = await db.logs.findMany({
                where: {
                    timestamp: {
                        gte: start,
                        lte: end
                    },
                },
                orderBy: { timestamp: 'desc'}
            });
            reply.send({ data });
        }
    } catch (e) {
        fastify.log.error(e);
        reply.status(500).send({ error: "Database error"});
    }
});
/**
 * add endpoints to get a certain amount of data back for filtering.
 * makes it so the user can fetch less data rather than one or all to add to filtering logic. 
 * */ 

fastify.addHook('onClose', async (instance, done) => {
    await db.$disconnect();
    done();
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();