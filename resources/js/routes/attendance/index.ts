import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:15
 * @route '/api/attendance/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/api/attendance/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:15
 * @route '/api/attendance/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:15
 * @route '/api/attendance/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:15
 * @route '/api/attendance/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:15
 * @route '/api/attendance/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const attendance = {
    verify: Object.assign(verify, verify),
}

export default attendance