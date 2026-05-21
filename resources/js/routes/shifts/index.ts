import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:11
 * @route '/shifts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/shifts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:11
 * @route '/shifts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:11
 * @route '/shifts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:11
 * @route '/shifts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:11
 * @route '/shifts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:11
 * @route '/shifts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ShiftController::index
 * @see app/Http/Controllers/ShiftController.php:11
 * @route '/shifts'
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
* @see \App\Http\Controllers\ShiftController::store
 * @see app/Http/Controllers/ShiftController.php:31
 * @route '/shifts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/shifts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ShiftController::store
 * @see app/Http/Controllers/ShiftController.php:31
 * @route '/shifts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShiftController::store
 * @see app/Http/Controllers/ShiftController.php:31
 * @route '/shifts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ShiftController::store
 * @see app/Http/Controllers/ShiftController.php:31
 * @route '/shifts'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ShiftController::store
 * @see app/Http/Controllers/ShiftController.php:31
 * @route '/shifts'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ShiftController::update
 * @see app/Http/Controllers/ShiftController.php:47
 * @route '/shifts/{shift}'
 */
export const update = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/shifts/{shift}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ShiftController::update
 * @see app/Http/Controllers/ShiftController.php:47
 * @route '/shifts/{shift}'
 */
update.url = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shift: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { shift: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    shift: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        shift: typeof args.shift === 'object'
                ? args.shift.id
                : args.shift,
                }

    return update.definition.url
            .replace('{shift}', parsedArgs.shift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShiftController::update
 * @see app/Http/Controllers/ShiftController.php:47
 * @route '/shifts/{shift}'
 */
update.put = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ShiftController::update
 * @see app/Http/Controllers/ShiftController.php:47
 * @route '/shifts/{shift}'
 */
update.patch = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ShiftController::update
 * @see app/Http/Controllers/ShiftController.php:47
 * @route '/shifts/{shift}'
 */
    const updateForm = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ShiftController::update
 * @see app/Http/Controllers/ShiftController.php:47
 * @route '/shifts/{shift}'
 */
        updateForm.put = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ShiftController::update
 * @see app/Http/Controllers/ShiftController.php:47
 * @route '/shifts/{shift}'
 */
        updateForm.patch = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ShiftController::destroy
 * @see app/Http/Controllers/ShiftController.php:63
 * @route '/shifts/{shift}'
 */
export const destroy = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/shifts/{shift}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ShiftController::destroy
 * @see app/Http/Controllers/ShiftController.php:63
 * @route '/shifts/{shift}'
 */
destroy.url = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shift: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { shift: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    shift: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        shift: typeof args.shift === 'object'
                ? args.shift.id
                : args.shift,
                }

    return destroy.definition.url
            .replace('{shift}', parsedArgs.shift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ShiftController::destroy
 * @see app/Http/Controllers/ShiftController.php:63
 * @route '/shifts/{shift}'
 */
destroy.delete = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ShiftController::destroy
 * @see app/Http/Controllers/ShiftController.php:63
 * @route '/shifts/{shift}'
 */
    const destroyForm = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ShiftController::destroy
 * @see app/Http/Controllers/ShiftController.php:63
 * @route '/shifts/{shift}'
 */
        destroyForm.delete = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const shifts = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default shifts