// import items from './dummyItems'


const categoryTags = [
    "mechanical",
    "integrated circuits",
    "controllers",
    "circuit building",
    "sensors",
    "others",
]
const tags = [
    ...categoryTags,
    "shield",
    "connector",
    "actuator",
    "human interface",
    "communication",
    "passive",
    "power",
    "breakout",
    "mcu",
    "processor",
]
let tagChips = [];
tags.forEach((tag) => {
    tagChips.push({
        name: tag
    });
});


export default {
    user: null,
    guest: true,
    notifCount: 0,
    categoryTags,
    categories: [
        {
            name: "Mechanical",
            icon: "mdi-wrench",
            notifs: 0,
        },
        {
            name: "Integrated Circuits",
            icon: "mdi-chip",
            notifs: 0,
        },
        {
            name: "Controllers",
            icon: "mdi-cpu-32-bit",
            notifs: 0,
        },
        {
            name: "Circuit Building",
            icon: "mdi-power-plug",
            notifs: 0,
        },
        {
            name: "Sensors",
            icon: "mdi-contactless-payment",
            notifs: 0,
        },
        {
            name: "Others",
            icon: "mdi-help",
            notifs: 0,
        },
    ],
    tagChips,
    tags,
    navTag: null,
    items: []
}