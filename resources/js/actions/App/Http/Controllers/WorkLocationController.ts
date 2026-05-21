import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkLocationController::index
 * @see app/Http/Controllers/WorkLocationController.php:12
 * @route '/work-locations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/work-locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkLocationController::index
 * @see app/Http/Controllers/WorkLocationController.php:12
 * @route '/work-locations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkLocationController::index
 * @see app/Http/Controllers/WorkLocationController.php:12
 * @route '/work-locations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkLocationController::index
 * @see app/Http/Controllers/WorkLocationController.php:12
 * @route '/work-locations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkLocationController::index
 * @see app/Http/Controllers/WorkLocationController.php:12
 * @route '/work-locations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkLocationController::index
 * @see app/Http/Controllers/WorkLocationController.php:12
 * @route '/work-locations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkLocationController::index
 * @see app/Http/Controllers/WorkLocationController.php:12
 * @route '/work-locations'
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
* @see \App\Http\Controllers\WorkLocationController::create
 * @see app/Http/Controllers/WorkLocationController.php:32
 * @route '/work-locations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/work-locations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkLocationController::create
 * @see app/Http/Controllers/WorkLocationController.php:32
 * @route '/work-locations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkLocationController::create
 * @see app/Http/Controllers/WorkLocationController.php:32
 * @route '/work-locations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkLocationController::create
 * @see app/Http/Controllers/WorkLocationController.php:32
 * @route '/work-locations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkLocationController::create
 * @see app/Http/Controllers/WorkLocationController.php:32
 * @route '/work-locations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkLocationController::create
 * @see app/Http/Controllers/WorkLocationController.php:32
 * @route '/work-locations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkLocationController::create
 * @see app/Http/Controllers/WorkLocationController.php:32
 * @route '/work-locations/create'
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
* @see \App\Http\Controllers\WorkLocationController::store
 * @see app/Http/Controllers/WorkLocationController.php:40
 * @route '/work-locations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/work-locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkLocationController::store
 * @see app/Http/Controllers/WorkLocationController.php:40
 * @route '/work-locations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkLocationController::store
 * @see app/Http/Controllers/WorkLocationController.php:40
 * @route '/work-locations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkLocationController::store
 * @see app/Http/Controllers/WorkLocationController.php:40
 * @route '/work-locations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkLocationController::store
 * @see app/Http/Controllers/WorkLocationController.php:40
 * @route '/work-locations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WorkLocationController::edit
 * @see app/Http/Controllers/WorkLocationController.php:68
 * @route '/work-locations/{work_location}/edit'
 */
export const edit = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/work-locations/{work_location}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkLocationController::edit
 * @see app/Http/Controllers/WorkLocationController.php:68
 * @route '/work-locations/{work_location}/edit'
 */
edit.url = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_location: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    work_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        work_location: args.work_location,
                }

    return edit.definition.url
            .replace('{work_location}', parsedArgs.work_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkLocationController::edit
 * @see app/Http/Controllers/WorkLocationController.php:68
 * @route '/work-locations/{work_location}/edit'
 */
edit.get = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkLocationController::edit
 * @see app/Http/Controllers/WorkLocationController.php:68
 * @route '/work-locations/{work_location}/edit'
 */
edit.head = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkLocationController::edit
 * @see app/Http/Controllers/WorkLocationController.php:68
 * @route '/work-locations/{work_location}/edit'
 */
    const editForm = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkLocationController::edit
 * @see app/Http/Controllers/WorkLocationController.php:68
 * @route '/work-locations/{work_location}/edit'
 */
        editForm.get = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkLocationController::edit
 * @see app/Http/Controllers/WorkLocationController.php:68
 * @route '/work-locations/{work_location}/edit'
 */
        editForm.head = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WorkLocationController::update
 * @see app/Http/Controllers/WorkLocationController.php:78
 * @route '/work-locations/{work_location}'
 */
export const update = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/work-locations/{work_location}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WorkLocationController::update
 * @see app/Http/Controllers/WorkLocationController.php:78
 * @route '/work-locations/{work_location}'
 */
update.url = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_location: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    work_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        work_location: args.work_location,
                }

    return update.definition.url
            .replace('{work_location}', parsedArgs.work_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkLocationController::update
 * @see app/Http/Controllers/WorkLocationController.php:78
 * @route '/work-locations/{work_location}'
 */
update.put = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\WorkLocationController::update
 * @see app/Http/Controllers/WorkLocationController.php:78
 * @route '/work-locations/{work_location}'
 */
update.patch = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WorkLocationController::update
 * @see app/Http/Controllers/WorkLocationController.php:78
 * @route '/work-locations/{work_location}'
 */
    const updateForm = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkLocationController::update
 * @see app/Http/Controllers/WorkLocationController.php:78
 * @route '/work-locations/{work_location}'
 */
        updateForm.put = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\WorkLocationController::update
 * @see app/Http/Controllers/WorkLocationController.php:78
 * @route '/work-locations/{work_location}'
 */
        updateForm.patch = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\WorkLocationController::destroy
 * @see app/Http/Controllers/WorkLocationController.php:112
 * @route '/work-locations/{work_location}'
 */
export const destroy = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/work-locations/{work_location}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkLocationController::destroy
 * @see app/Http/Controllers/WorkLocationController.php:112
 * @route '/work-locations/{work_location}'
 */
destroy.url = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { work_location: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    work_location: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        work_location: args.work_location,
                }

    return destroy.definition.url
            .replace('{work_location}', parsedArgs.work_location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkLocationController::destroy
 * @see app/Http/Controllers/WorkLocationController.php:112
 * @route '/work-locations/{work_location}'
 */
destroy.delete = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WorkLocationController::destroy
 * @see app/Http/Controllers/WorkLocationController.php:112
 * @route '/work-locations/{work_location}'
 */
    const destroyForm = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkLocationController::destroy
 * @see app/Http/Controllers/WorkLocationController.php:112
 * @route '/work-locations/{work_location}'
 */
        destroyForm.delete = (args: { work_location: string | number } | [work_location: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const WorkLocationController = { index, create, store, edit, update, destroy }

export default WorkLocationController