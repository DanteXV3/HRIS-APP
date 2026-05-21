import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FaceAttendanceController::kiosk
 * @see app/Http/Controllers/FaceAttendanceController.php:154
 * @route '/face-attendance'
 */
export const kiosk = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kiosk.url(options),
    method: 'get',
})

kiosk.definition = {
    methods: ["get","head"],
    url: '/face-attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FaceAttendanceController::kiosk
 * @see app/Http/Controllers/FaceAttendanceController.php:154
 * @route '/face-attendance'
 */
kiosk.url = (options?: RouteQueryOptions) => {
    return kiosk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaceAttendanceController::kiosk
 * @see app/Http/Controllers/FaceAttendanceController.php:154
 * @route '/face-attendance'
 */
kiosk.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kiosk.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FaceAttendanceController::kiosk
 * @see app/Http/Controllers/FaceAttendanceController.php:154
 * @route '/face-attendance'
 */
kiosk.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kiosk.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FaceAttendanceController::kiosk
 * @see app/Http/Controllers/FaceAttendanceController.php:154
 * @route '/face-attendance'
 */
    const kioskForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: kiosk.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FaceAttendanceController::kiosk
 * @see app/Http/Controllers/FaceAttendanceController.php:154
 * @route '/face-attendance'
 */
        kioskForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kiosk.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FaceAttendanceController::kiosk
 * @see app/Http/Controllers/FaceAttendanceController.php:154
 * @route '/face-attendance'
 */
        kioskForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: kiosk.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    kiosk.form = kioskForm
/**
* @see \App\Http\Controllers\FaceAttendanceController::descriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
export const descriptors = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descriptors.url(options),
    method: 'get',
})

descriptors.definition = {
    methods: ["get","head"],
    url: '/api/face-descriptors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FaceAttendanceController::descriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
descriptors.url = (options?: RouteQueryOptions) => {
    return descriptors.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaceAttendanceController::descriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
descriptors.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descriptors.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FaceAttendanceController::descriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
descriptors.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descriptors.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FaceAttendanceController::descriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
    const descriptorsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descriptors.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FaceAttendanceController::descriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
        descriptorsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descriptors.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FaceAttendanceController::descriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
        descriptorsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descriptors.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descriptors.form = descriptorsForm
/**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/api/face-attendance/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FaceAttendanceController::verify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const faceAttendance = {
    kiosk: Object.assign(kiosk, kiosk),
descriptors: Object.assign(descriptors, descriptors),
verify: Object.assign(verify, verify),
}

export default faceAttendance