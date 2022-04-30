module.exports.getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if(!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json(user);
    } 
    
    catch (err) {
        res.status(500).json({
            message: err
        });
    }
}