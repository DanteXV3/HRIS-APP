import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
    const meForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: me.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
        meForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
        meForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    me.form = meForm
/**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
export const updateMe = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMe.url(options),
    method: 'put',
})

updateMe.definition = {
    methods: ["put"],
    url: '/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
updateMe.url = (options?: RouteQueryOptions) => {
    return updateMe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
updateMe.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMe.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
    const updateMeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateMe.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
        updateMeForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateMe.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateMe.form = updateMeForm
/**
* @see \App\Http\Controllers\EmployeeController::signature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
export const signature = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: signature.url(options),
    method: 'post',
})

signature.definition = {
    methods: ["post"],
    url: '/profile/signature',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::signature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
signature.url = (options?: RouteQueryOptions) => {
    return signature.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::signature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
signature.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: signature.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::signature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
    const signatureForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: signature.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::signature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
        signatureForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: signature.url(options),
            method: 'post',
        })
    
    signature.form = signatureForm
/**
* @see \App\Http\Controllers\EmployeeController::faceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
export const faceDescriptor = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: faceDescriptor.url(options),
    method: 'post',
})

faceDescriptor.definition = {
    methods: ["post"],
    url: '/profile/face-descriptor',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::faceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
faceDescriptor.url = (options?: RouteQueryOptions) => {
    return faceDescriptor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::faceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
faceDescriptor.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: faceDescriptor.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::faceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
    const faceDescriptorForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: faceDescriptor.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::faceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
        faceDescriptorForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: faceDescriptor.url(options),
            method: 'post',
        })
    
    faceDescriptor.form = faceDescriptorForm
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:20
 * @route '/settings/profile'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:20
 * @route '/settings/profile'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:20
 * @route '/settings/profile'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:20
 * @route '/settings/profile'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:20
 * @route '/settings/profile'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:20
 * @route '/settings/profile'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\ProfileController::edit
 * @see app/Http/Controllers/Settings/ProfileController.php:20
 * @route '/settings/profile'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:31
 * @route '/settings/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:31
 * @route '/settings/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:31
 * @route '/settings/profile'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:31
 * @route '/settings/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::update
 * @see app/Http/Controllers/Settings/ProfileController.php:31
 * @route '/settings/profile'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:47
 * @route '/settings/profile'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/profile',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:47
 * @route '/settings/profile'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:47
 * @route '/settings/profile'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:47
 * @route '/settings/profile'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\ProfileController::destroy
 * @see app/Http/Controllers/Settings/ProfileController.php:47
 * @route '/settings/profile'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const profile = {
    me: Object.assign(me, me),
updateMe: Object.assign(updateMe, updateMe),
signature: Object.assign(signature, signature),
faceDescriptor: Object.assign(faceDescriptor, faceDescriptor),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default profile