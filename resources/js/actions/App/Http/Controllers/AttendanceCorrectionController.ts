import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceCorrectionController::index
 * @see app/Http/Controllers/AttendanceCorrectionController.php:15
 * @route '/attendance-corrections'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/attendance-corrections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::index
 * @see app/Http/Controllers/AttendanceCorrectionController.php:15
 * @route '/attendance-corrections'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::index
 * @see app/Http/Controllers/AttendanceCorrectionController.php:15
 * @route '/attendance-corrections'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceCorrectionController::index
 * @see app/Http/Controllers/AttendanceCorrectionController.php:15
 * @route '/attendance-corrections'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceCorrectionController::index
 * @see app/Http/Controllers/AttendanceCorrectionController.php:15
 * @route '/attendance-corrections'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceCorrectionController::index
 * @see app/Http/Controllers/AttendanceCorrectionController.php:15
 * @route '/attendance-corrections'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceCorrectionController::index
 * @see app/Http/Controllers/AttendanceCorrectionController.php:15
 * @route '/attendance-corrections'
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
* @see \App\Http\Controllers\AttendanceCorrectionController::store
 * @see app/Http/Controllers/AttendanceCorrectionController.php:41
 * @route '/attendance-corrections'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/attendance-corrections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::store
 * @see app/Http/Controllers/AttendanceCorrectionController.php:41
 * @route '/attendance-corrections'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::store
 * @see app/Http/Controllers/AttendanceCorrectionController.php:41
 * @route '/attendance-corrections'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceCorrectionController::store
 * @see app/Http/Controllers/AttendanceCorrectionController.php:41
 * @route '/attendance-corrections'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceCorrectionController::store
 * @see app/Http/Controllers/AttendanceCorrectionController.php:41
 * @route '/attendance-corrections'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AttendanceCorrectionController::update
 * @see app/Http/Controllers/AttendanceCorrectionController.php:71
 * @route '/attendance-corrections/{correction}'
 */
export const update = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/attendance-corrections/{correction}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::update
 * @see app/Http/Controllers/AttendanceCorrectionController.php:71
 * @route '/attendance-corrections/{correction}'
 */
update.url = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { correction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { correction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    correction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        correction: typeof args.correction === 'object'
                ? args.correction.id
                : args.correction,
                }

    return update.definition.url
            .replace('{correction}', parsedArgs.correction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::update
 * @see app/Http/Controllers/AttendanceCorrectionController.php:71
 * @route '/attendance-corrections/{correction}'
 */
update.put = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AttendanceCorrectionController::update
 * @see app/Http/Controllers/AttendanceCorrectionController.php:71
 * @route '/attendance-corrections/{correction}'
 */
    const updateForm = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceCorrectionController::update
 * @see app/Http/Controllers/AttendanceCorrectionController.php:71
 * @route '/attendance-corrections/{correction}'
 */
        updateForm.put = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\AttendanceCorrectionController::destroy
 * @see app/Http/Controllers/AttendanceCorrectionController.php:156
 * @route '/attendance-corrections/{correction}'
 */
export const destroy = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/attendance-corrections/{correction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::destroy
 * @see app/Http/Controllers/AttendanceCorrectionController.php:156
 * @route '/attendance-corrections/{correction}'
 */
destroy.url = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { correction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { correction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    correction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        correction: typeof args.correction === 'object'
                ? args.correction.id
                : args.correction,
                }

    return destroy.definition.url
            .replace('{correction}', parsedArgs.correction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceCorrectionController::destroy
 * @see app/Http/Controllers/AttendanceCorrectionController.php:156
 * @route '/attendance-corrections/{correction}'
 */
destroy.delete = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AttendanceCorrectionController::destroy
 * @see app/Http/Controllers/AttendanceCorrectionController.php:156
 * @route '/attendance-corrections/{correction}'
 */
    const destroyForm = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceCorrectionController::destroy
 * @see app/Http/Controllers/AttendanceCorrectionController.php:156
 * @route '/attendance-corrections/{correction}'
 */
        destroyForm.delete = (args: { correction: number | { id: number } } | [correction: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AttendanceCorrectionController = { index, store, update, destroy }

export default AttendanceCorrectionController