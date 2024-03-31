const asyncHandler = (requestHanlder) => {
    return (req, res, next) => {
        Promise.resolve(requestHanlder(req, res, next))
            .catch((err) => next(err))
    }
}


export default asyncHandler


// const asyncHandler = (func) => (req, res, next) => {
//     try {
//         func(req, res, next)
//     }
//     catch (error) {
//         res.status(err.code || 500).json(
//             {
//                 success: false,
//                 message: err.message
//             }
//         )
//     }
// }