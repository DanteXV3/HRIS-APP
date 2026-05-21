import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PaymentRequestController::index
 * @see app/Http/Controllers/PaymentRequestController.php:17
 * @route '/payment-requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payment-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::index
 * @see app/Http/Controllers/PaymentRequestController.php:17
 * @route '/payment-requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::index
 * @see app/Http/Controllers/PaymentRequestController.php:17
 * @route '/payment-requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentRequestController::index
 * @see app/Http/Controllers/PaymentRequestController.php:17
 * @route '/payment-requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::index
 * @see app/Http/Controllers/PaymentRequestController.php:17
 * @route '/payment-requests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::index
 * @see app/Http/Controllers/PaymentRequestController.php:17
 * @route '/payment-requests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentRequestController::index
 * @see app/Http/Controllers/PaymentRequestController.php:17
 * @route '/payment-requests'
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
* @see \App\Http\Controllers\PaymentRequestController::create
 * @see app/Http/Controllers/PaymentRequestController.php:58
 * @route '/payment-requests/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/payment-requests/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::create
 * @see app/Http/Controllers/PaymentRequestController.php:58
 * @route '/payment-requests/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::create
 * @see app/Http/Controllers/PaymentRequestController.php:58
 * @route '/payment-requests/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentRequestController::create
 * @see app/Http/Controllers/PaymentRequestController.php:58
 * @route '/payment-requests/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::create
 * @see app/Http/Controllers/PaymentRequestController.php:58
 * @route '/payment-requests/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::create
 * @see app/Http/Controllers/PaymentRequestController.php:58
 * @route '/payment-requests/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentRequestController::create
 * @see app/Http/Controllers/PaymentRequestController.php:58
 * @route '/payment-requests/create'
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
* @see \App\Http\Controllers\PaymentRequestController::store
 * @see app/Http/Controllers/PaymentRequestController.php:86
 * @route '/payment-requests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payment-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::store
 * @see app/Http/Controllers/PaymentRequestController.php:86
 * @route '/payment-requests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::store
 * @see app/Http/Controllers/PaymentRequestController.php:86
 * @route '/payment-requests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::store
 * @see app/Http/Controllers/PaymentRequestController.php:86
 * @route '/payment-requests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::store
 * @see app/Http/Controllers/PaymentRequestController.php:86
 * @route '/payment-requests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PaymentRequestController::show
 * @see app/Http/Controllers/PaymentRequestController.php:183
 * @route '/payment-requests/{payment_request}'
 */
export const show = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payment-requests/{payment_request}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::show
 * @see app/Http/Controllers/PaymentRequestController.php:183
 * @route '/payment-requests/{payment_request}'
 */
show.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return show.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::show
 * @see app/Http/Controllers/PaymentRequestController.php:183
 * @route '/payment-requests/{payment_request}'
 */
show.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentRequestController::show
 * @see app/Http/Controllers/PaymentRequestController.php:183
 * @route '/payment-requests/{payment_request}'
 */
show.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::show
 * @see app/Http/Controllers/PaymentRequestController.php:183
 * @route '/payment-requests/{payment_request}'
 */
    const showForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::show
 * @see app/Http/Controllers/PaymentRequestController.php:183
 * @route '/payment-requests/{payment_request}'
 */
        showForm.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentRequestController::show
 * @see app/Http/Controllers/PaymentRequestController.php:183
 * @route '/payment-requests/{payment_request}'
 */
        showForm.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PaymentRequestController::edit
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}/edit'
 */
export const edit = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/payment-requests/{payment_request}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::edit
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}/edit'
 */
edit.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return edit.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::edit
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}/edit'
 */
edit.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentRequestController::edit
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}/edit'
 */
edit.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::edit
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}/edit'
 */
    const editForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::edit
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}/edit'
 */
        editForm.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentRequestController::edit
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}/edit'
 */
        editForm.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PaymentRequestController::update
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
export const update = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/payment-requests/{payment_request}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::update
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
update.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return update.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::update
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
update.put = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\PaymentRequestController::update
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
update.patch = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::update
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
    const updateForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::update
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
        updateForm.put = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\PaymentRequestController::update
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
        updateForm.patch = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PaymentRequestController::destroy
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
export const destroy = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payment-requests/{payment_request}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::destroy
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
destroy.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return destroy.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::destroy
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
destroy.delete = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::destroy
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
    const destroyForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::destroy
 * @see app/Http/Controllers/PaymentRequestController.php:0
 * @route '/payment-requests/{payment_request}'
 */
        destroyForm.delete = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PaymentRequestController::approve
 * @see app/Http/Controllers/PaymentRequestController.php:194
 * @route '/payment-requests/{payment_request}/approve'
 */
export const approve = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/payment-requests/{payment_request}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::approve
 * @see app/Http/Controllers/PaymentRequestController.php:194
 * @route '/payment-requests/{payment_request}/approve'
 */
approve.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return approve.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::approve
 * @see app/Http/Controllers/PaymentRequestController.php:194
 * @route '/payment-requests/{payment_request}/approve'
 */
approve.post = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::approve
 * @see app/Http/Controllers/PaymentRequestController.php:194
 * @route '/payment-requests/{payment_request}/approve'
 */
    const approveForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::approve
 * @see app/Http/Controllers/PaymentRequestController.php:194
 * @route '/payment-requests/{payment_request}/approve'
 */
        approveForm.post = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\PaymentRequestController::reject
 * @see app/Http/Controllers/PaymentRequestController.php:256
 * @route '/payment-requests/{payment_request}/reject'
 */
export const reject = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/payment-requests/{payment_request}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::reject
 * @see app/Http/Controllers/PaymentRequestController.php:256
 * @route '/payment-requests/{payment_request}/reject'
 */
reject.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return reject.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::reject
 * @see app/Http/Controllers/PaymentRequestController.php:256
 * @route '/payment-requests/{payment_request}/reject'
 */
reject.post = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::reject
 * @see app/Http/Controllers/PaymentRequestController.php:256
 * @route '/payment-requests/{payment_request}/reject'
 */
    const rejectForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::reject
 * @see app/Http/Controllers/PaymentRequestController.php:256
 * @route '/payment-requests/{payment_request}/reject'
 */
        rejectForm.post = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\PaymentRequestController::downloadPdf
 * @see app/Http/Controllers/PaymentRequestController.php:278
 * @route '/payment-requests/{payment_request}/pdf'
 */
export const downloadPdf = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

downloadPdf.definition = {
    methods: ["get","head"],
    url: '/payment-requests/{payment_request}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::downloadPdf
 * @see app/Http/Controllers/PaymentRequestController.php:278
 * @route '/payment-requests/{payment_request}/pdf'
 */
downloadPdf.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return downloadPdf.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::downloadPdf
 * @see app/Http/Controllers/PaymentRequestController.php:278
 * @route '/payment-requests/{payment_request}/pdf'
 */
downloadPdf.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentRequestController::downloadPdf
 * @see app/Http/Controllers/PaymentRequestController.php:278
 * @route '/payment-requests/{payment_request}/pdf'
 */
downloadPdf.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::downloadPdf
 * @see app/Http/Controllers/PaymentRequestController.php:278
 * @route '/payment-requests/{payment_request}/pdf'
 */
    const downloadPdfForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::downloadPdf
 * @see app/Http/Controllers/PaymentRequestController.php:278
 * @route '/payment-requests/{payment_request}/pdf'
 */
        downloadPdfForm.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentRequestController::downloadPdf
 * @see app/Http/Controllers/PaymentRequestController.php:278
 * @route '/payment-requests/{payment_request}/pdf'
 */
        downloadPdfForm.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadPdf.form = downloadPdfForm
/**
* @see \App\Http\Controllers\PaymentRequestController::whatsappUrl
 * @see app/Http/Controllers/PaymentRequestController.php:293
 * @route '/payment-requests/{payment_request}/whatsapp'
 */
export const whatsappUrl = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappUrl.url(args, options),
    method: 'get',
})

whatsappUrl.definition = {
    methods: ["get","head"],
    url: '/payment-requests/{payment_request}/whatsapp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PaymentRequestController::whatsappUrl
 * @see app/Http/Controllers/PaymentRequestController.php:293
 * @route '/payment-requests/{payment_request}/whatsapp'
 */
whatsappUrl.url = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment_request: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payment_request: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment_request: args.payment_request,
                }

    return whatsappUrl.definition.url
            .replace('{payment_request}', parsedArgs.payment_request.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PaymentRequestController::whatsappUrl
 * @see app/Http/Controllers/PaymentRequestController.php:293
 * @route '/payment-requests/{payment_request}/whatsapp'
 */
whatsappUrl.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappUrl.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PaymentRequestController::whatsappUrl
 * @see app/Http/Controllers/PaymentRequestController.php:293
 * @route '/payment-requests/{payment_request}/whatsapp'
 */
whatsappUrl.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: whatsappUrl.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PaymentRequestController::whatsappUrl
 * @see app/Http/Controllers/PaymentRequestController.php:293
 * @route '/payment-requests/{payment_request}/whatsapp'
 */
    const whatsappUrlForm = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: whatsappUrl.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PaymentRequestController::whatsappUrl
 * @see app/Http/Controllers/PaymentRequestController.php:293
 * @route '/payment-requests/{payment_request}/whatsapp'
 */
        whatsappUrlForm.get = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsappUrl.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PaymentRequestController::whatsappUrl
 * @see app/Http/Controllers/PaymentRequestController.php:293
 * @route '/payment-requests/{payment_request}/whatsapp'
 */
        whatsappUrlForm.head = (args: { payment_request: string | number } | [payment_request: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsappUrl.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    whatsappUrl.form = whatsappUrlForm
const PaymentRequestController = { index, create, store, show, edit, update, destroy, approve, reject, downloadPdf, whatsappUrl }

export default PaymentRequestController