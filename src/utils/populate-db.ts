import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function createEffectType(name: string) {
  return prisma.effectType.create({
    data: { name },
  });
}

function createTag(name: string) {
  return prisma.tag.create({
    data: { name },
  });
}

async function populateDb() {
  const testUser = await prisma.user.create({
    data: {
      name: "Test User",
    },
  });

  const ammoCapacity = await createEffectType("ammo capacity");
  const reloadSpeed = await createEffectType("reload speed");
  const damage = await createEffectType("damage");
  const moveSpeed = await createEffectType("move speed");
  const bulletDamage = await createEffectType("bullet damage");

  const adminReload = await prisma.card.create({
    data: {
      name: "Admin Reload",
      type: "offense",
      affinity: "fortune",
      image: "",
      secondaryEffects: {
        create: {
          effect: "When you stow your weapon, it reloads.",
          team: false,
        },
      },
    },
  });

  const adrenalineFueled = await prisma.card.create({
    data: {
      name: "Adrenaline Fueled",
      type: "offense",
      affinity: "reflex",
      image: "",
      secondaryEffects: {
        create: {
          effect:
            "When you kill an enemy, gain 5 Stamina instantly and an additional 7 Stamina over 7 seconds, stacking up to 5 times.",
          team: false,
        },
      },
    },
  });

  const aiAssistantModule = await prisma.card.create({
    data: {
      name: "AI Assistant Module",
      type: "ability",
      affinity: "fortune",
      image: "",
      secondaryEffects: {
        create: {
          effect:
            "5% Item Reuse Chance that increases by 10% after every item used. Resets on Reuse. Gadget Cost: 20 Sniper Rifle Ammo. REPLACES: Quick Slot, FRAGILE (Effects removed after recieving damage)",
          team: false,
        },
      },
    },
  });

  const ammoBelt = await prisma.card.create({
    data: {
      name: "Ammo Belt",
      type: "offense",
      affinity: "discipline",
      image: "",
      statEffects: {
        create: [
          {
            amount: 50,
            percent: true,
            team: false,
            type: {
              connect: {
                id: ammoCapacity.id,
              },
            },
          },
          {
            amount: 15,
            percent: true,
            team: false,
            type: {
              connect: {
                id: reloadSpeed.id,
              },
            },
          },
        ],
      },
    },
  });

  const ammoForAll = await prisma.card.create({
    data: {
      name: "Ammo for All",
      type: "offense",
      affinity: "discipline",
      image: "",
      statEffects: {
        create: [
          {
            amount: 10,
            percent: true,
            team: true,
            type: {
              connect: {
                id: ammoCapacity.id,
              },
            },
          },
          {
            amount: 2.5,
            percent: true,
            team: true,
            type: {
              connect: {
                id: damage.id,
              },
            },
          },
        ],
      },
    },
  });

  const ammoMule = await prisma.card.create({
    data: {
      name: "Ammo Mule",
      type: "offense",
      affinity: "discipline",
      image: "",
      statEffects: {
        create: [
          {
            amount: 75,
            percent: true,
            team: false,
            type: {
              connect: {
                id: ammoCapacity.id,
              },
            },
          },
          {
            amount: -5,
            percent: true,
            team: false,
            type: {
              connect: {
                id: moveSpeed.id,
              },
            },
          },
        ],
      },
    },
  });

  const ammoPouch = await prisma.card.create({
    data: {
      name: "Ammo Pouch",
      type: "offense",
      affinity: "discipline",
      image: "",
      statEffects: {
        create: [
          {
            amount: 25,
            percent: true,
            team: false,
            type: {
              connect: {
                id: ammoCapacity.id,
              },
            },
          },
          {
            amount: 2.5,
            percent: true,
            team: false,
            type: {
              connect: {
                id: bulletDamage.id,
              },
            },
          },
        ],
      },
    },
  });

  const hollyTag = await createTag("Holly");
  const walkerTag = await createTag("Walker");
  const danTag = await createTag("Prophet Dan");
  const nightmareTag = await createTag("Nightmare");
  const noMercyTag = await createTag("No Mercy");

  await prisma.deck.create({
    data: {
      name: "Test deck 1",
      description: "This is just a test!!",
      cards: {
        connect: [
          { id: adminReload.id },
          { id: adrenalineFueled.id },
          { id: aiAssistantModule.id },
          { id: ammoBelt.id },
          { id: ammoForAll.id },
          { id: ammoMule.id },
          { id: ammoPouch.id },
        ],
      },
      tags: {
        connect: [
          { id: danTag.id },
          { id: hollyTag.id },
          { id: nightmareTag.id },
        ],
      },
      creator: {
        connect: {
          id: testUser.id,
        },
      },
    },
  });

  await prisma.deck.create({
    data: {
      name: "Test deck 2",
      cards: {
        connect: [{ id: adminReload.id }, { id: ammoPouch.id }],
      },
      tags: {
        connect: [{ id: walkerTag.id }, { id: noMercyTag.id }],
      },
      creator: {
        connect: {
          id: testUser.id,
        },
      },
    },
  });
}

populateDb()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
