const asyncHandler = (requestHanlder) => {
    (req, res, next) => {
        Promise.resolve(requestHanlder(req, res, next))
            .catch((err) => next(err))
    }
}



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