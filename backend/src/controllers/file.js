const User = require('../models/User.js');
const Resource = require('../models/Resource.js');

const fs = require('fs');
const unzipper = require('unzipper');

// module.exports.downloadAll = async (req, res) => {
//     const user = await User.findById(req.user._id);
//     const resources = await Resource.find({user: user._id});
//     const zip = new JSZip();
//     resources.forEach(resource => {
//         zip.file(resource.name, resource.data);
//     });
//     zip.generateAsync({type: 'nodebuffer'})
//         .then(content => {
//             res.setHeader('Content-disposition', 'attachment; filename=resources.zip');
//             res.setHeader('Content-type', 'application/zip');
//             res.status(200).send(content);
//         });
// };

module.exports.sharedResources = async (req, res) => {
    const files = fs.readdirSync('uploads/shared').map(file => {
        return {
            name: file,
            path: `uploads/shared/${file}`,
            size: fs.statSync(`./uploads/shared/${file}`).size
        }
     });

    if(files.length === 0) {
        res.status(200).json({
            message: 'No files found'
        });
    }

    res.status(200).send(files);
}

module.exports.getMyResources = async (req, res) => {
    const resources = await Resource.find({user: req.user._id}).lean();
    res.status(200).send(resources);
};

module.exports.download = async (req, res) => {
    try {
        const userId = req.user._id;
        const fileName = req.params.file_name;

        const file = await Resource.findOne({ name: fileName, user: userId }).lean();

        if(!file) {
            return res.status(404).json({
                message: 'File not found'
            });
        }

        return res.download(file.path, file.name);
    } 
    
    catch (err) {
        res.status(500).json({
            message: err
        });
    }
}

module.exports.uploadFileEnd = async(req, res) => {
    const isAdmin = req.user.isAdmin;

    if(!isAdmin) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    const subscribes = await User.find({ subscription: { $gt: new Date().getTime() } }, { subscription: 1, _id: 1})
    
    const fn = fs.readdirSync('./uploads/tpm')[0]

    const zip = fs.createReadStream('uploads/tpm/' + fn).pipe(unzipper.Parse({forceStream: true}));
    let add = 0;

    for await(const entry of zip) {
        const fileName = entry.path;
        const type = entry.type;
        const size = entry.vars.uncompressedSize;

        if(type === 'File') {
            if(add < subscribes.length) {
                entry.pipe(fs.createWriteStream('uploads/unique/'));

                const user = subscribes[add];

                await Resource.create({
                    name: fileName,
                    path: `uploads/unique/${fileName}`,
                    size,
                    user: user._id
                });
                add++
            }
    
            else {
                entry.pipe(fs.createWriteStream('uploads/shared/'));
            }
        }
    }

    fs.unlinkSync('./uploads/tpm/' + fn);

    return res.status(200).json({
        message: 'File unpucking'
    });
}