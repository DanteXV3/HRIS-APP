import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\KpiEvaluationController::index
 * @see app/Http/Controllers/KpiEvaluationController.php:14
 * @route '/kpi-evaluations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kpi-evaluations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::index
 * @see app/Http/Controllers/KpiEvaluationController.php:14
 * @route '/kpi-evaluations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::index
 * @see app/Http/Controllers/KpiEvaluationController.php:14
 * @route '/kpi-evaluations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiEvaluationController::index
 * @see app/Http/Controllers/KpiEvaluationController.php:14
 * @route '/kpi-evaluations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::index
 * @see app/Http/Controllers/KpiEvaluationController.php:14
 * @route '/kpi-evaluations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::index
 * @see app/Http/Controllers/KpiEvaluationController.php:14
 * @route '/kpi-evaluations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiEvaluationController::index
 * @see app/Http/Controllers/KpiEvaluationController.php:14
 * @route '/kpi-evaluations'
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
* @see \App\Http\Controllers\KpiEvaluationController::create
 * @see app/Http/Controllers/KpiEvaluationController.php:46
 * @route '/kpi-evaluations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/kpi-evaluations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::create
 * @see app/Http/Controllers/KpiEvaluationController.php:46
 * @route '/kpi-evaluations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::create
 * @see app/Http/Controllers/KpiEvaluationController.php:46
 * @route '/kpi-evaluations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiEvaluationController::create
 * @see app/Http/Controllers/KpiEvaluationController.php:46
 * @route '/kpi-evaluations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::create
 * @see app/Http/Controllers/KpiEvaluationController.php:46
 * @route '/kpi-evaluations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::create
 * @see app/Http/Controllers/KpiEvaluationController.php:46
 * @route '/kpi-evaluations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiEvaluationController::create
 * @see app/Http/Controllers/KpiEvaluationController.php:46
 * @route '/kpi-evaluations/create'
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
* @see \App\Http\Controllers\KpiEvaluationController::store
 * @see app/Http/Controllers/KpiEvaluationController.php:61
 * @route '/kpi-evaluations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kpi-evaluations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::store
 * @see app/Http/Controllers/KpiEvaluationController.php:61
 * @route '/kpi-evaluations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::store
 * @see app/Http/Controllers/KpiEvaluationController.php:61
 * @route '/kpi-evaluations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::store
 * @see app/Http/Controllers/KpiEvaluationController.php:61
 * @route '/kpi-evaluations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::store
 * @see app/Http/Controllers/KpiEvaluationController.php:61
 * @route '/kpi-evaluations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\KpiEvaluationController::show
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
export const show = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kpi-evaluations/{kpi_evaluation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::show
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
show.url = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_evaluation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_evaluation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_evaluation: args.kpi_evaluation,
                }

    return show.definition.url
            .replace('{kpi_evaluation}', parsedArgs.kpi_evaluation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::show
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
show.get = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiEvaluationController::show
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
show.head = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::show
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
    const showForm = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::show
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
        showForm.get = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiEvaluationController::show
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
        showForm.head = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\KpiEvaluationController::edit
 * @see app/Http/Controllers/KpiEvaluationController.php:91
 * @route '/kpi-evaluations/{kpi_evaluation}/edit'
 */
export const edit = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/kpi-evaluations/{kpi_evaluation}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::edit
 * @see app/Http/Controllers/KpiEvaluationController.php:91
 * @route '/kpi-evaluations/{kpi_evaluation}/edit'
 */
edit.url = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_evaluation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_evaluation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_evaluation: args.kpi_evaluation,
                }

    return edit.definition.url
            .replace('{kpi_evaluation}', parsedArgs.kpi_evaluation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::edit
 * @see app/Http/Controllers/KpiEvaluationController.php:91
 * @route '/kpi-evaluations/{kpi_evaluation}/edit'
 */
edit.get = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiEvaluationController::edit
 * @see app/Http/Controllers/KpiEvaluationController.php:91
 * @route '/kpi-evaluations/{kpi_evaluation}/edit'
 */
edit.head = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::edit
 * @see app/Http/Controllers/KpiEvaluationController.php:91
 * @route '/kpi-evaluations/{kpi_evaluation}/edit'
 */
    const editForm = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::edit
 * @see app/Http/Controllers/KpiEvaluationController.php:91
 * @route '/kpi-evaluations/{kpi_evaluation}/edit'
 */
        editForm.get = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiEvaluationController::edit
 * @see app/Http/Controllers/KpiEvaluationController.php:91
 * @route '/kpi-evaluations/{kpi_evaluation}/edit'
 */
        editForm.head = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\KpiEvaluationController::update
 * @see app/Http/Controllers/KpiEvaluationController.php:117
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
export const update = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/kpi-evaluations/{kpi_evaluation}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::update
 * @see app/Http/Controllers/KpiEvaluationController.php:117
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
update.url = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_evaluation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_evaluation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_evaluation: args.kpi_evaluation,
                }

    return update.definition.url
            .replace('{kpi_evaluation}', parsedArgs.kpi_evaluation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::update
 * @see app/Http/Controllers/KpiEvaluationController.php:117
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
update.put = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\KpiEvaluationController::update
 * @see app/Http/Controllers/KpiEvaluationController.php:117
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
update.patch = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::update
 * @see app/Http/Controllers/KpiEvaluationController.php:117
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
    const updateForm = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::update
 * @see app/Http/Controllers/KpiEvaluationController.php:117
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
        updateForm.put = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\KpiEvaluationController::update
 * @see app/Http/Controllers/KpiEvaluationController.php:117
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
        updateForm.patch = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\KpiEvaluationController::destroy
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
export const destroy = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/kpi-evaluations/{kpi_evaluation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::destroy
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
destroy.url = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_evaluation: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_evaluation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_evaluation: args.kpi_evaluation,
                }

    return destroy.definition.url
            .replace('{kpi_evaluation}', parsedArgs.kpi_evaluation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::destroy
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
destroy.delete = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::destroy
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
    const destroyForm = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::destroy
 * @see app/Http/Controllers/KpiEvaluationController.php:0
 * @route '/kpi-evaluations/{kpi_evaluation}'
 */
        destroyForm.delete = (args: { kpi_evaluation: string | number } | [kpi_evaluation: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\KpiEvaluationController::whatsapp
 * @see app/Http/Controllers/KpiEvaluationController.php:166
 * @route '/kpi-evaluations/{evaluation}/whatsapp'
 */
export const whatsapp = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsapp.url(args, options),
    method: 'get',
})

whatsapp.definition = {
    methods: ["get","head"],
    url: '/kpi-evaluations/{evaluation}/whatsapp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::whatsapp
 * @see app/Http/Controllers/KpiEvaluationController.php:166
 * @route '/kpi-evaluations/{evaluation}/whatsapp'
 */
whatsapp.url = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluation: typeof args.evaluation === 'object'
                ? args.evaluation.id
                : args.evaluation,
                }

    return whatsapp.definition.url
            .replace('{evaluation}', parsedArgs.evaluation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::whatsapp
 * @see app/Http/Controllers/KpiEvaluationController.php:166
 * @route '/kpi-evaluations/{evaluation}/whatsapp'
 */
whatsapp.get = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsapp.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiEvaluationController::whatsapp
 * @see app/Http/Controllers/KpiEvaluationController.php:166
 * @route '/kpi-evaluations/{evaluation}/whatsapp'
 */
whatsapp.head = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: whatsapp.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::whatsapp
 * @see app/Http/Controllers/KpiEvaluationController.php:166
 * @route '/kpi-evaluations/{evaluation}/whatsapp'
 */
    const whatsappForm = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: whatsapp.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::whatsapp
 * @see app/Http/Controllers/KpiEvaluationController.php:166
 * @route '/kpi-evaluations/{evaluation}/whatsapp'
 */
        whatsappForm.get = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsapp.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiEvaluationController::whatsapp
 * @see app/Http/Controllers/KpiEvaluationController.php:166
 * @route '/kpi-evaluations/{evaluation}/whatsapp'
 */
        whatsappForm.head = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsapp.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    whatsapp.form = whatsappForm
/**
* @see \App\Http\Controllers\KpiEvaluationController::pdf
 * @see app/Http/Controllers/KpiEvaluationController.php:207
 * @route '/kpi-evaluations/{evaluation}/pdf'
 */
export const pdf = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/kpi-evaluations/{evaluation}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiEvaluationController::pdf
 * @see app/Http/Controllers/KpiEvaluationController.php:207
 * @route '/kpi-evaluations/{evaluation}/pdf'
 */
pdf.url = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { evaluation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { evaluation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    evaluation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        evaluation: typeof args.evaluation === 'object'
                ? args.evaluation.id
                : args.evaluation,
                }

    return pdf.definition.url
            .replace('{evaluation}', parsedArgs.evaluation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiEvaluationController::pdf
 * @see app/Http/Controllers/KpiEvaluationController.php:207
 * @route '/kpi-evaluations/{evaluation}/pdf'
 */
pdf.get = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiEvaluationController::pdf
 * @see app/Http/Controllers/KpiEvaluationController.php:207
 * @route '/kpi-evaluations/{evaluation}/pdf'
 */
pdf.head = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiEvaluationController::pdf
 * @see app/Http/Controllers/KpiEvaluationController.php:207
 * @route '/kpi-evaluations/{evaluation}/pdf'
 */
    const pdfForm = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiEvaluationController::pdf
 * @see app/Http/Controllers/KpiEvaluationController.php:207
 * @route '/kpi-evaluations/{evaluation}/pdf'
 */
        pdfForm.get = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiEvaluationController::pdf
 * @see app/Http/Controllers/KpiEvaluationController.php:207
 * @route '/kpi-evaluations/{evaluation}/pdf'
 */
        pdfForm.head = (args: { evaluation: number | { id: number } } | [evaluation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
const kpiEvaluations = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
whatsapp: Object.assign(whatsapp, whatsapp),
pdf: Object.assign(pdf, pdf),
}

export default kpiEvaluations