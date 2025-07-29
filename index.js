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
fastify.get("/logs/:id", async function (request, reply) {
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