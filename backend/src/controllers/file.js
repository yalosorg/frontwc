const User = require('../models/User.js');
const Resource = require('../models/Resource.js');

const fs = require('fs');
//const unzipper = require('unzipper');
const JSZip = require('jszip');
const path = require('path');

module.exports.downloadAll = async (req, res) => {
    const userId = req.user._id;

    try {
        const zip = new JSZip();
        
        let uniqueFiles = await Resource.find({ user: userId }).lean();
        if (uniqueFiles.length == 0) uniqueFiles = [];

        uniqueFiles.map(file => {
            const data = fs.readFileSync(file.path);
            zip.file(path.basename(file.path), data);
        });
        
        fs.readdirSync('uploads/shared').map(file => {
            const data = fs.readFileSync(`uploads/shared/${file}`);
            zip.file(file, data);
        });

        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs.createWriteStream('all.zip')).on('finish', () => {
            console.log('all.zip bundled');
            res.download('all.zip');
        });
    } catch (err) {
        res.status(400).json({ error: err });
    }
};

module.exports.downloadNew = async (req, res) => {
    const userId = req.user._id;

    try {
        const zip = new JSZip();

        let uniqueFiles = await Resource.find({ user: userId }).lean();
        if (files.length == 0) uniqueFiles = [];

        uniqueFiles.map(file => {
            // GET DATE BY NAME
            let fn = path.basename(path.basename(file.path), path.extname(file.path));
            // fn = fn - "-newzip" at the end
            fn.substring(0, fn.length - 7);
            let uploaded = new Date(fn); // надеюсь спарситься блять
            let today = new Date();

            if (uploaded.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
                const data = fs.readFileSync(file.path);
                zip.file(path.basename(file.path), data);
            }
        });

        fs.readdirSync('uploads/shared').map(file => {
            let fn = path.basename(file);
            fn.substring(0, fn.length - 7);
            let uploaded = new Date(fn);
            let today = new Date();
            
            if (uploaded.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
                const data = fs.readFileSync(`uploads/shared/${file}`);
                zip.file(file, data);
            }
        });

        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(fs.createWriteStream('new.zip')).on('finish', () => {
            console.log('new.zip bundled');
            res.download('new.zip');
        });
    } catch (err) {
        res.status(400).json({ error: err });
    }
}

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

    console.log(files);

    if (files.length === 0) {
        return res.status(200).json([]);
    }

    res.status(200).json(files);
}

module.exports.getMyResources = async (req, res) => {
    const resources = await Resource.find({ user: req.user._id }).lean();
    if (!resources) return res.status(200).json([]);

    res.status(200).json(resources);
};

module.exports.downloadUnique = async (req, res) => {
    try {
        const userId = req.params.user_id;

        const files = await Resource.find({ user: userId }).lean();
        if (files.length == 0) return res.status(404).json({ message: 'no files found' });
        // найти все файлы в бд с unique юзером и найти сами файлы в uploads/unique и запихнуть все это в один архив


        // name: { type: String, required: true, unique: true },
        // path: { type: String, required: true },

        // size: { type: Number, required: true },
        // user: {
        //     ref: 'Accounts',
        //         type: Schema.Types.ObjectId
        // }

        // file.path КОРОЧЕ ДА

        let zip = new JSZip();

        for (const file of files) {
            console.log(file);
            const data = fs.readFileSync(file.path);
            zip.file(path.basename(file.path), data);
        }

        // files.forEach(file => {
        //     console.log(file);
        //     const data = fs.readFileSync(file.path);
        //     zip.file(path.basename(file.path), data);
        // });

        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream('sample.zip'))
            .on('finish', function () {
                console.log("sample.zip written.");
                res.download('sample.zip');
            });
    }

    catch (err) {
        res.status(500).json({
            message: err
        });
    }
};

module.exports.download = async (req, res) => {
    const fileName = req.body.file_name;
    // через fs найти файл с этим именем и скачать
    const existsInShared = fs.existsSync(`./uploads/shared/${fileName}`);
    if (!existsInShared) {
        const existsInUnique = fs.existsSync(`./uploads/unique/${fileName}`);
        if (!existsInUnique)
            return res.status(404).json({ message: "file doesn't exist" });

        // файл находится в папке unique
        return res.status(200).download(`./uploads/unique/${fileName}`);
    }

    // файл находится в папке shared
    return res.status(200).download(`./uploads/shared/${fileName}`);
}

// function formatFileSize(bytes, decimalPoint) {
//     if (bytes == 0) return '0 Bytes';
//     var k = 1000,
//         dm = decimalPoint || 2,
//         sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
//         i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// }

module.exports.uploadFileEnd = async (req, res) => {
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    const subscribes = await User.find({ subscription: { $gt: new Date().getTime() } }, { subscription: 1, _id: 1 })
    console.log(subscribes);

    const fn = fs.readdirSync('./uploads/tpm')[0];

    const files = fs.readdirSync('./uploads/tpm');
    console.log(files);

    let unique = 0;
    files.forEach(async file => {
        const type = file.type;

        // в бд сайз хранится в байтах поэтому это нихуя не нужно оно наоборот ебаную ошибку кидает
        // const size = formatFileSize(fs.statSync(`./uploads/tpm/${file}`).size);

        if (unique < subscribes.length && subscribes.length !== 0) {
            fs.copyFileSync(`./uploads/tpm/${file}`, `./uploads/unique/${file}`);

            const user = subscribes[unique];
            await Resource.create({
                name: file,
                path: `./uploads/unique/${file}`,
                size: fs.statSync(`./uploads/tpm/${file}`).size,
                user: user._id
            });
            unique++;
        } else {
            fs.copyFileSync(`./uploads/tpm/${file}`, `./uploads/shared/${file}`);
        }

        fs.unlinkSync(`./uploads/tpm/${file}`);
    });

    return res.status(200).json({ message: 'Files published' });
}