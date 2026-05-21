import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ExitPermitController::index
 * @see app/Http/Controllers/ExitPermitController.php:19
 * @route '/exit-permits'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/exit-permits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExitPermitController::index
 * @see app/Http/Controllers/ExitPermitController.php:19
 * @route '/exit-permits'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExitPermitController::index
 * @see app/Http/Controllers/ExitPermitController.php:19
 * @route '/exit-permits'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExitPermitController::index
 * @see app/Http/Controllers/ExitPermitController.php:19
 * @route '/exit-permits'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ExitPermitController::index
 * @see app/Http/Controllers/ExitPermitController.php:19
 * @route '/exit-permits'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ExitPermitController::index
 * @see app/Http/Controllers/ExitPermitController.php:19
 * @route '/exit-permits'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ExitPermitController::index
 * @see app/Http/Controllers/ExitPermitController.php:19
 * @route '/exit-permits'
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
* @see \App\Http\Controllers\ExitPermitController::create
 * @see app/Http/Controllers/ExitPermitController.php:52
 * @route '/exit-permits/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/exit-permits/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExitPermitController::create
 * @see app/Http/Controllers/ExitPermitController.php:52
 * @route '/exit-permits/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExitPermitController::create
 * @see app/Http/Controllers/ExitPermitController.php:52
 * @route '/exit-permits/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExitPermitController::create
 * @see app/Http/Controllers/ExitPermitController.php:52
 * @route '/exit-permits/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ExitPermitController::create
 * @see app/Http/Controllers/ExitPermitController.php:52
 * @route '/exit-permits/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ExitPermitController::create
 * @see app/Http/Controllers/ExitPermitController.php:52
 * @route '/exit-permits/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ExitPermitController::create
 * @see app/Http/Controllers/ExitPermitController.php:52
 * @route '/exit-permits/create'
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
* @see \App\Http\Controllers\ExitPermitController::store
 * @see app/Http/Controllers/ExitPermitController.php:57
 * @route '/exit-permits'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/exit-permits',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExitPermitController::store
 * @see app/Http/Controllers/ExitPermitController.php:57
 * @route '/exit-permits'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExitPermitController::store
 * @see app/Http/Controllers/ExitPermitController.php:57
 * @route '/exit-permits'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ExitPermitController::store
 * @see app/Http/Controllers/ExitPermitController.php:57
 * @route '/exit-permits'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ExitPermitController::store
 * @see app/Http/Controllers/ExitPermitController.php:57
 * @route '/exit-permits'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const exitPermits = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
}

export default exitPermits