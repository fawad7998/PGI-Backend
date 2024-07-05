// handleDuplicates.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function handleDuplicateEmails() {
    const duplicates = await prisma.organization.groupBy({
        by: ['businessEmail'],
        having: {
            businessEmail: {
                _count: {
                    gt: 1,
                },
            },
        },
    });

    for (const duplicate of duplicates) {
        const duplicateEmails = await prisma.organization.findMany({
            where: {
                businessEmail: duplicate.businessEmail,
            },
        });

        for (let i = 1; i < duplicateEmails.length; i++) {
            await prisma.organization.delete({
                where: {
                    organization_id: duplicateEmails[i].organization_id,
                },
            });
        }
    }

    console.log('Duplicate emails handled');
}

handleDuplicateEmails()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
