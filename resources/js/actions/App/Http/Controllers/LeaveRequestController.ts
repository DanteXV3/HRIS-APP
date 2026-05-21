import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LeaveRequestController::index
 * @see app/Http/Controllers/LeaveRequestController.php:22
 * @route '/leaves'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/leaves',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::index
 * @see app/Http/Controllers/LeaveRequestController.php:22
 * @route '/leaves'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::index
 * @see app/Http/Controllers/LeaveRequestController.php:22
 * @route '/leaves'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaveRequestController::index
 * @see app/Http/Controllers/LeaveRequestController.php:22
 * @route '/leaves'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeaveRequestController::index
 * @see app/Http/Controllers/LeaveRequestController.php:22
 * @route '/leaves'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeaveRequestController::index
 * @see app/Http/Controllers/LeaveRequestController.php:22
 * @route '/leaves'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeaveRequestController::index
 * @see app/Http/Controllers/LeaveRequestController.php:22
 * @route '/leaves'
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
* @see \App\Http\Controllers\LeaveRequestController::create
 * @see app/Http/Controllers/LeaveRequestController.php:107
 * @route '/leaves/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/leaves/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::create
 * @see app/Http/Controllers/LeaveRequestController.php:107
 * @route '/leaves/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::create
 * @see app/Http/Controllers/LeaveRequestController.php:107
 * @route '/leaves/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaveRequestController::create
 * @see app/Http/Controllers/LeaveRequestController.php:107
 * @route '/leaves/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeaveRequestController::create
 * @see app/Http/Controllers/LeaveRequestController.php:107
 * @route '/leaves/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeaveRequestController::create
 * @see app/Http/Controllers/LeaveRequestController.php:107
 * @route '/leaves/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeaveRequestController::create
 * @see app/Http/Controllers/LeaveRequestController.php:107
 * @route '/leaves/create'
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
* @see \App\Http\Controllers\LeaveRequestController::store
 * @see app/Http/Controllers/LeaveRequestController.php:141
 * @route '/leaves'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/leaves',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::store
 * @see app/Http/Controllers/LeaveRequestController.php:141
 * @route '/leaves'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::store
 * @see app/Http/Controllers/LeaveRequestController.php:141
 * @route '/leaves'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LeaveRequestController::store
 * @see app/Http/Controllers/LeaveRequestController.php:141
 * @route '/leaves'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeaveRequestController::store
 * @see app/Http/Controllers/LeaveRequestController.php:141
 * @route '/leaves'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LeaveRequestController::show
 * @see app/Http/Controllers/LeaveRequestController.php:227
 * @route '/leaves/{leave}'
 */
export const show = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/leaves/{leave}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::show
 * @see app/Http/Controllers/LeaveRequestController.php:227
 * @route '/leaves/{leave}'
 */
show.url = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave: typeof args.leave === 'object'
                ? args.leave.id
                : args.leave,
                }

    return show.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::show
 * @see app/Http/Controllers/LeaveRequestController.php:227
 * @route '/leaves/{leave}'
 */
show.get = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaveRequestController::show
 * @see app/Http/Controllers/LeaveRequestController.php:227
 * @route '/leaves/{leave}'
 */
show.head = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeaveRequestController::show
 * @see app/Http/Controllers/LeaveRequestController.php:227
 * @route '/leaves/{leave}'
 */
    const showForm = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeaveRequestController::show
 * @see app/Http/Controllers/LeaveRequestController.php:227
 * @route '/leaves/{leave}'
 */
        showForm.get = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeaveRequestController::show
 * @see app/Http/Controllers/LeaveRequestController.php:227
 * @route '/leaves/{leave}'
 */
        showForm.head = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LeaveRequestController::approve
 * @see app/Http/Controllers/LeaveRequestController.php:250
 * @route '/leaves/{leave}/approve'
 */
export const approve = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/leaves/{leave}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::approve
 * @see app/Http/Controllers/LeaveRequestController.php:250
 * @route '/leaves/{leave}/approve'
 */
approve.url = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave: typeof args.leave === 'object'
                ? args.leave.id
                : args.leave,
                }

    return approve.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::approve
 * @see app/Http/Controllers/LeaveRequestController.php:250
 * @route '/leaves/{leave}/approve'
 */
approve.post = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LeaveRequestController::approve
 * @see app/Http/Controllers/LeaveRequestController.php:250
 * @route '/leaves/{leave}/approve'
 */
    const approveForm = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeaveRequestController::approve
 * @see app/Http/Controllers/LeaveRequestController.php:250
 * @route '/leaves/{leave}/approve'
 */
        approveForm.post = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\LeaveRequestController::reject
 * @see app/Http/Controllers/LeaveRequestController.php:337
 * @route '/leaves/{leave}/reject'
 */
export const reject = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/leaves/{leave}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::reject
 * @see app/Http/Controllers/LeaveRequestController.php:337
 * @route '/leaves/{leave}/reject'
 */
reject.url = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave: typeof args.leave === 'object'
                ? args.leave.id
                : args.leave,
                }

    return reject.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::reject
 * @see app/Http/Controllers/LeaveRequestController.php:337
 * @route '/leaves/{leave}/reject'
 */
reject.post = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LeaveRequestController::reject
 * @see app/Http/Controllers/LeaveRequestController.php:337
 * @route '/leaves/{leave}/reject'
 */
    const rejectForm = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LeaveRequestController::reject
 * @see app/Http/Controllers/LeaveRequestController.php:337
 * @route '/leaves/{leave}/reject'
 */
        rejectForm.post = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\LeaveRequestController::whatsappUrl
 * @see app/Http/Controllers/LeaveRequestController.php:398
 * @route '/leaves/{leave}/whatsapp'
 */
export const whatsappUrl = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappUrl.url(args, options),
    method: 'get',
})

whatsappUrl.definition = {
    methods: ["get","head"],
    url: '/leaves/{leave}/whatsapp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LeaveRequestController::whatsappUrl
 * @see app/Http/Controllers/LeaveRequestController.php:398
 * @route '/leaves/{leave}/whatsapp'
 */
whatsappUrl.url = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { leave: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { leave: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    leave: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        leave: typeof args.leave === 'object'
                ? args.leave.id
                : args.leave,
                }

    return whatsappUrl.definition.url
            .replace('{leave}', parsedArgs.leave.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LeaveRequestController::whatsappUrl
 * @see app/Http/Controllers/LeaveRequestController.php:398
 * @route '/leaves/{leave}/whatsapp'
 */
whatsappUrl.get = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappUrl.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LeaveRequestController::whatsappUrl
 * @see app/Http/Controllers/LeaveRequestController.php:398
 * @route '/leaves/{leave}/whatsapp'
 */
whatsappUrl.head = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: whatsappUrl.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LeaveRequestController::whatsappUrl
 * @see app/Http/Controllers/LeaveRequestController.php:398
 * @route '/leaves/{leave}/whatsapp'
 */
    const whatsappUrlForm = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: whatsappUrl.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LeaveRequestController::whatsappUrl
 * @see app/Http/Controllers/LeaveRequestController.php:398
 * @route '/leaves/{leave}/whatsapp'
 */
        whatsappUrlForm.get = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsappUrl.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LeaveRequestController::whatsappUrl
 * @see app/Http/Controllers/LeaveRequestController.php:398
 * @route '/leaves/{leave}/whatsapp'
 */
        whatsappUrlForm.head = (args: { leave: number | { id: number } } | [leave: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsappUrl.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    whatsappUrl.form = whatsappUrlForm
const LeaveRequestController = { index, create, store, show, approve, reject, whatsappUrl }

export default LeaveRequestController