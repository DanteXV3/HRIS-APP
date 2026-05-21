import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:18
 * @route '/dashboard'
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
* @see \App\Http\Controllers\DashboardController::acknowledgeEvaluation
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/acknowledge-evaluation'
 */
export const acknowledgeEvaluation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledgeEvaluation.url(options),
    method: 'post',
})

acknowledgeEvaluation.definition = {
    methods: ["post"],
    url: '/dashboard/acknowledge-evaluation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::acknowledgeEvaluation
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/acknowledge-evaluation'
 */
acknowledgeEvaluation.url = (options?: RouteQueryOptions) => {
    return acknowledgeEvaluation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::acknowledgeEvaluation
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/acknowledge-evaluation'
 */
acknowledgeEvaluation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledgeEvaluation.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DashboardController::acknowledgeEvaluation
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/acknowledge-evaluation'
 */
    const acknowledgeEvaluationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: acknowledgeEvaluation.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DashboardController::acknowledgeEvaluation
 * @see app/Http/Controllers/DashboardController.php:112
 * @route '/dashboard/acknowledge-evaluation'
 */
        acknowledgeEvaluationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: acknowledgeEvaluation.url(options),
            method: 'post',
        })
    
    acknowledgeEvaluation.form = acknowledgeEvaluationForm
const DashboardController = { index, acknowledgeEvaluation }

export default DashboardController