import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
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
const dashboard = {
    acknowledgeEvaluation: Object.assign(acknowledgeEvaluation, acknowledgeEvaluation),
}

export default dashboard