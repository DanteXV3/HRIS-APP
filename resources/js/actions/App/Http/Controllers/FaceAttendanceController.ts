import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\FaceAttendanceController::getDescriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
export const getDescriptors = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDescriptors.url(options),
    method: 'get',
})

getDescriptors.definition = {
    methods: ["get","head"],
    url: '/api/face-descriptors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FaceAttendanceController::getDescriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
getDescriptors.url = (options?: RouteQueryOptions) => {
    return getDescriptors.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaceAttendanceController::getDescriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
getDescriptors.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDescriptors.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FaceAttendanceController::getDescriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
getDescriptors.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDescriptors.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FaceAttendanceController::getDescriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
    const getDescriptorsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDescriptors.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FaceAttendanceController::getDescriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
        getDescriptorsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDescriptors.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FaceAttendanceController::getDescriptors
 * @see app/Http/Controllers/FaceAttendanceController.php:162
 * @route '/api/face-descriptors'
 */
        getDescriptorsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDescriptors.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDescriptors.form = getDescriptorsForm
/**
* @see \App\Http\Controllers\FaceAttendanceController::publicVerify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
export const publicVerify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publicVerify.url(options),
    method: 'post',
})

publicVerify.definition = {
    methods: ["post"],
    url: '/api/face-attendance/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FaceAttendanceController::publicVerify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
publicVerify.url = (options?: RouteQueryOptions) => {
    return publicVerify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FaceAttendanceController::publicVerify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
publicVerify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publicVerify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FaceAttendanceController::publicVerify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
    const publicVerifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publicVerify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FaceAttendanceController::publicVerify
 * @see app/Http/Controllers/FaceAttendanceController.php:181
 * @route '/api/face-attendance/verify'
 */
        publicVerifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publicVerify.url(options),
            method: 'post',
        })
    
    publicVerify.form = publicVerifyForm
const FaceAttendanceController = { verify, kiosk, getDescriptors, publicVerify }

export default FaceAttendanceController