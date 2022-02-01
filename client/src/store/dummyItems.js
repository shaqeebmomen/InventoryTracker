let items = [];
for (let index = 0; index < 6; index++) {
    const data = {
        name: "Part Name ",
        tags: ['mcu', 'breakout'],
        qty: 0,
        description: 'This is the part description',
        categories: ['sensors', 'controllers'],
        warningQty: 1,
        resources: [
            {
                name: 'resource1',
                detail: 'https://www.google.com'
            },
            {
                name: 'resource2',
                detail: 'Interesting info'
            }

        ],
        _id: index
    }
    items.push(data);
};

module.exports = items;