const Part = require('../models/Part');

module.exports = {

    // get all part data
    parts_all_get: async (req, res) => {

        try {
            const parts = await Part.find();
            // If a guest is making the request, select a subset of the parts they need to load
            if (res.locals.guest) {
                if (parts.length > 20) {
                    // Set is large enough to slice
                    res.status(201).send(parts.slice(0, 20));
                }
                else {
                    res.status(201).send(parts);
                }
            }
            else {
                res.status(201).send(parts);
            }

        } catch (err) {
            console.log('error getting all parts');
            console.log(err.message);
            res.status(500).send();
        }
    },

    // get specific part data
    part_get: async (req, res) => {
        // get part from db
        try {
            const part = await Part.findById(req.params.id);
            res.status(201).json(part);
        } catch (err) {
            // part couldnt be found
            console.log('error finding part: ', req.params.id);
            console.log(err.message);
            res.status(500).send();
        }
    },

    // add a new part to the db
    part_post: async (req, res) => {
        // get part data from request
        const part = new Part(req.body);

        // save part then response
        try {
            const result = await part.save();
            res.status(201).json(result);
        } catch (err) {
            console.log('error saving part');
            console.log(err.message);
            res.status(500).send();
        }
    },

    // update a part already on the db
    part_put: async (req, res) => {
        // find reference in db
        let part;
        try {
            // part = await Part.findOne({name: req.body.name});
            part = await Part.findById(req.body._id);
            // overwrite properties in the document with request body obj
            part.overwrite(req.body);
        } catch (err) {
            // cannot find item in db
            console.log('cannot find item: ', req.body._id);
            console.log(err.message);
            res.status(400).send();
        }

        // update part then send response
        try {
            await part.save();
            res.status(201).json(req.body);
        } catch (err) {
            console.log('error updating part');
            console.log(err.message);
            res.status(500).send();
        }
    },

    // remove a part on the db
    part_delete: async (req, res) => {
        // find part by id and delete it
        try {
            // Returns document that was deleted or null if none
            const result = await Part.findByIdAndDelete(req.params.id);
            if (result) {
                res.status(202).send();

            } else {
                console.log('couldnt find part to delete');
                res.status(400).send();
            }

        } catch (err) {
            console.log('error deleting part');
            console.log(err.message);
            res.status(400).send();
        }
    }
}