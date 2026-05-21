import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\HolidayController::index
 * @see app/Http/Controllers/HolidayController.php:20
 * @route '/holidays'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/holidays',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HolidayController::index
 * @see app/Http/Controllers/HolidayController.php:20
 * @route '/holidays'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HolidayController::index
 * @see app/Http/Controllers/HolidayController.php:20
 * @route '/holidays'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HolidayController::index
 * @see app/Http/Controllers/HolidayController.php:20
 * @route '/holidays'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\HolidayController::index
 * @see app/Http/Controllers/HolidayController.php:20
 * @route '/holidays'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\HolidayController::index
 * @see app/Http/Controllers/HolidayController.php:20
 * @route '/holidays'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\HolidayController::index
 * @see app/Http/Controllers/HolidayController.php:20
 * @route '/holidays'
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
* @see \App\Http\Controllers\HolidayController::create
 * @see app/Http/Controllers/HolidayController.php:28
 * @route '/holidays/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/holidays/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HolidayController::create
 * @see app/Http/Controllers/HolidayController.php:28
 * @route '/holidays/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HolidayController::create
 * @see app/Http/Controllers/HolidayController.php:28
 * @route '/holidays/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HolidayController::create
 * @see app/Http/Controllers/HolidayController.php:28
 * @route '/holidays/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\HolidayController::create
 * @see app/Http/Controllers/HolidayController.php:28
 * @route '/holidays/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\HolidayController::create
 * @see app/Http/Controllers/HolidayController.php:28
 * @route '/holidays/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\HolidayController::create
 * @see app/Http/Controllers/HolidayController.php:28
 * @route '/holidays/create'
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
* @see \App\Http\Controllers\HolidayController::store
 * @see app/Http/Controllers/HolidayController.php:34
 * @route '/holidays'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/holidays',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HolidayController::store
 * @see app/Http/Controllers/HolidayController.php:34
 * @route '/holidays'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HolidayController::store
 * @see app/Http/Controllers/HolidayController.php:34
 * @route '/holidays'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\HolidayController::store
 * @see app/Http/Controllers/HolidayController.php:34
 * @route '/holidays'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HolidayController::store
 * @see app/Http/Controllers/HolidayController.php:34
 * @route '/holidays'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\HolidayController::edit
 * @see app/Http/Controllers/HolidayController.php:46
 * @route '/holidays/{holiday}/edit'
 */
export const edit = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/holidays/{holiday}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HolidayController::edit
 * @see app/Http/Controllers/HolidayController.php:46
 * @route '/holidays/{holiday}/edit'
 */
edit.url = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { holiday: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { holiday: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    holiday: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        holiday: typeof args.holiday === 'object'
                ? args.holiday.id
                : args.holiday,
                }

    return edit.definition.url
            .replace('{holiday}', parsedArgs.holiday.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HolidayController::edit
 * @see app/Http/Controllers/HolidayController.php:46
 * @route '/holidays/{holiday}/edit'
 */
edit.get = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HolidayController::edit
 * @see app/Http/Controllers/HolidayController.php:46
 * @route '/holidays/{holiday}/edit'
 */
edit.head = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\HolidayController::edit
 * @see app/Http/Controllers/HolidayController.php:46
 * @route '/holidays/{holiday}/edit'
 */
    const editForm = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\HolidayController::edit
 * @see app/Http/Controllers/HolidayController.php:46
 * @route '/holidays/{holiday}/edit'
 */
        editForm.get = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\HolidayController::edit
 * @see app/Http/Controllers/HolidayController.php:46
 * @route '/holidays/{holiday}/edit'
 */
        editForm.head = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\HolidayController::update
 * @see app/Http/Controllers/HolidayController.php:54
 * @route '/holidays/{holiday}'
 */
export const update = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/holidays/{holiday}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\HolidayController::update
 * @see app/Http/Controllers/HolidayController.php:54
 * @route '/holidays/{holiday}'
 */
update.url = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { holiday: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { holiday: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    holiday: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        holiday: typeof args.holiday === 'object'
                ? args.holiday.id
                : args.holiday,
                }

    return update.definition.url
            .replace('{holiday}', parsedArgs.holiday.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HolidayController::update
 * @see app/Http/Controllers/HolidayController.php:54
 * @route '/holidays/{holiday}'
 */
update.put = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\HolidayController::update
 * @see app/Http/Controllers/HolidayController.php:54
 * @route '/holidays/{holiday}'
 */
update.patch = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\HolidayController::update
 * @see app/Http/Controllers/HolidayController.php:54
 * @route '/holidays/{holiday}'
 */
    const updateForm = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HolidayController::update
 * @see app/Http/Controllers/HolidayController.php:54
 * @route '/holidays/{holiday}'
 */
        updateForm.put = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\HolidayController::update
 * @see app/Http/Controllers/HolidayController.php:54
 * @route '/holidays/{holiday}'
 */
        updateForm.patch = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HolidayController::destroy
 * @see app/Http/Controllers/HolidayController.php:66
 * @route '/holidays/{holiday}'
 */
export const destroy = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/holidays/{holiday}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HolidayController::destroy
 * @see app/Http/Controllers/HolidayController.php:66
 * @route '/holidays/{holiday}'
 */
destroy.url = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { holiday: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { holiday: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    holiday: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        holiday: typeof args.holiday === 'object'
                ? args.holiday.id
                : args.holiday,
                }

    return destroy.definition.url
            .replace('{holiday}', parsedArgs.holiday.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HolidayController::destroy
 * @see app/Http/Controllers/HolidayController.php:66
 * @route '/holidays/{holiday}'
 */
destroy.delete = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\HolidayController::destroy
 * @see app/Http/Controllers/HolidayController.php:66
 * @route '/holidays/{holiday}'
 */
    const destroyForm = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HolidayController::destroy
 * @see app/Http/Controllers/HolidayController.php:66
 * @route '/holidays/{holiday}'
 */
        destroyForm.delete = (args: { holiday: number | { id: number } } | [holiday: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const holidays = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default holidays