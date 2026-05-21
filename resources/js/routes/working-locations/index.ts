import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WorkingLocationController::index
 * @see app/Http/Controllers/WorkingLocationController.php:11
 * @route '/working-locations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/working-locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkingLocationController::index
 * @see app/Http/Controllers/WorkingLocationController.php:11
 * @route '/working-locations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkingLocationController::index
 * @see app/Http/Controllers/WorkingLocationController.php:11
 * @route '/working-locations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkingLocationController::index
 * @see app/Http/Controllers/WorkingLocationController.php:11
 * @route '/working-locations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkingLocationController::index
 * @see app/Http/Controllers/WorkingLocationController.php:11
 * @route '/working-locations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkingLocationController::index
 * @see app/Http/Controllers/WorkingLocationController.php:11
 * @route '/working-locations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkingLocationController::index
 * @see app/Http/Controllers/WorkingLocationController.php:11
 * @route '/working-locations'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\WorkingLocationController::create
 * @see app/Http/Controllers/WorkingLocationController.php:31
 * @route '/working-locations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/working-locations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkingLocationController::create
 * @see app/Http/Controllers/WorkingLocationController.php:31
 * @route '/working-locations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkingLocationController::create
 * @see app/Http/Controllers/WorkingLocationController.php:31
 * @route '/working-locations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkingLocationController::create
 * @see app/Http/Controllers/WorkingLocationController.php:31
 * @route '/working-locations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkingLocationController::create
 * @see app/Http/Controllers/WorkingLocationController.php:31
 * @route '/working-locations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkingLocationController::create
 * @see app/Http/Controllers/WorkingLocationController.php:31
 * @route '/working-locations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkingLocationController::create
 * @see app/Http/Controllers/WorkingLocationController.php:31
 * @route '/working-locations/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\WorkingLocationController::store
 * @see app/Http/Controllers/WorkingLocationController.php:39
 * @route '/working-locations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/working-locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkingLocationController::store
 * @see app/Http/Controllers/WorkingLocationController.php:39
 * @route '/working-locations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkingLocationController::store
 * @see app/Http/Controllers/WorkingLocationController.php:39
 * @route '/working-locations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkingLocationController::store
 * @see app/Http/Controllers/WorkingLocationController.php:39
 * @route '/working-locations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkingLocationController::store
 * @see app/Http/Controllers/WorkingLocationController.php:39
 * @route '/working-locations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WorkingLocationController::edit
 * @see app/Http/Controllers/WorkingLocationController.php:58
 * @route '/working-locations/{working_location}/edit'
 */
export const edit = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/working-locations/{working_location}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkingLocationController::edit
 * @see app/Http/Controllers/WorkingLocationController.php:58
 * @route '/working-locations/{working_location}/edit'
 */
edit.url = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { working_location: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    working_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        working_location: args.working_location,
                }

    return edit.definition.url
            .replace('{working_location}', parsedArgs.working_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkingLocationController::edit
 * @see app/Http/Controllers/WorkingLocationController.php:58
 * @route '/working-locations/{working_location}/edit'
 */
edit.get = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkingLocationController::edit
 * @see app/Http/Controllers/WorkingLocationController.php:58
 * @route '/working-locations/{working_location}/edit'
 */
edit.head = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkingLocationController::edit
 * @see app/Http/Controllers/WorkingLocationController.php:58
 * @route '/working-locations/{working_location}/edit'
 */
    const editForm = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkingLocationController::edit
 * @see app/Http/Controllers/WorkingLocationController.php:58
 * @route '/working-locations/{working_location}/edit'
 */
        editForm.get = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkingLocationController::edit
 * @see app/Http/Controllers/WorkingLocationController.php:58
 * @route '/working-locations/{working_location}/edit'
 */
        editForm.head = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\WorkingLocationController::update
 * @see app/Http/Controllers/WorkingLocationController.php:68
 * @route '/working-locations/{working_location}'
 */
export const update = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/working-locations/{working_location}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WorkingLocationController::update
 * @see app/Http/Controllers/WorkingLocationController.php:68
 * @route '/working-locations/{working_location}'
 */
update.url = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { working_location: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    working_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        working_location: args.working_location,
                }

    return update.definition.url
            .replace('{working_location}', parsedArgs.working_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkingLocationController::update
 * @see app/Http/Controllers/WorkingLocationController.php:68
 * @route '/working-locations/{working_location}'
 */
update.put = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\WorkingLocationController::update
 * @see app/Http/Controllers/WorkingLocationController.php:68
 * @route '/working-locations/{working_location}'
 */
update.patch = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WorkingLocationController::update
 * @see app/Http/Controllers/WorkingLocationController.php:68
 * @route '/working-locations/{working_location}'
 */
    const updateForm = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkingLocationController::update
 * @see app/Http/Controllers/WorkingLocationController.php:68
 * @route '/working-locations/{working_location}'
 */
        updateForm.put = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\WorkingLocationController::update
 * @see app/Http/Controllers/WorkingLocationController.php:68
 * @route '/working-locations/{working_location}'
 */
        updateForm.patch = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\WorkingLocationController::destroy
 * @see app/Http/Controllers/WorkingLocationController.php:87
 * @route '/working-locations/{working_location}'
 */
export const destroy = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/working-locations/{working_location}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkingLocationController::destroy
 * @see app/Http/Controllers/WorkingLocationController.php:87
 * @route '/working-locations/{working_location}'
 */
destroy.url = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { working_location: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    working_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        working_location: args.working_location,
                }

    return destroy.definition.url
            .replace('{working_location}', parsedArgs.working_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkingLocationController::destroy
 * @see app/Http/Controllers/WorkingLocationController.php:87
 * @route '/working-locations/{working_location}'
 */
destroy.delete = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WorkingLocationController::destroy
 * @see app/Http/Controllers/WorkingLocationController.php:87
 * @route '/working-locations/{working_location}'
 */
    const destroyForm = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkingLocationController::destroy
 * @see app/Http/Controllers/WorkingLocationController.php:87
 * @route '/working-locations/{working_location}'
 */
        destroyForm.delete = (args: { working_location: string | number } | [working_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const workingLocations = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default workingLocations