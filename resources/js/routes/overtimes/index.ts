import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OvertimeController::index
 * @see app/Http/Controllers/OvertimeController.php:17
 * @route '/overtimes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/overtimes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OvertimeController::index
 * @see app/Http/Controllers/OvertimeController.php:17
 * @route '/overtimes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::index
 * @see app/Http/Controllers/OvertimeController.php:17
 * @route '/overtimes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OvertimeController::index
 * @see app/Http/Controllers/OvertimeController.php:17
 * @route '/overtimes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OvertimeController::index
 * @see app/Http/Controllers/OvertimeController.php:17
 * @route '/overtimes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::index
 * @see app/Http/Controllers/OvertimeController.php:17
 * @route '/overtimes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OvertimeController::index
 * @see app/Http/Controllers/OvertimeController.php:17
 * @route '/overtimes'
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
* @see \App\Http\Controllers\OvertimeController::create
 * @see app/Http/Controllers/OvertimeController.php:68
 * @route '/overtimes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/overtimes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OvertimeController::create
 * @see app/Http/Controllers/OvertimeController.php:68
 * @route '/overtimes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::create
 * @see app/Http/Controllers/OvertimeController.php:68
 * @route '/overtimes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OvertimeController::create
 * @see app/Http/Controllers/OvertimeController.php:68
 * @route '/overtimes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OvertimeController::create
 * @see app/Http/Controllers/OvertimeController.php:68
 * @route '/overtimes/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::create
 * @see app/Http/Controllers/OvertimeController.php:68
 * @route '/overtimes/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OvertimeController::create
 * @see app/Http/Controllers/OvertimeController.php:68
 * @route '/overtimes/create'
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
* @see \App\Http\Controllers\OvertimeController::store
 * @see app/Http/Controllers/OvertimeController.php:81
 * @route '/overtimes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/overtimes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OvertimeController::store
 * @see app/Http/Controllers/OvertimeController.php:81
 * @route '/overtimes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::store
 * @see app/Http/Controllers/OvertimeController.php:81
 * @route '/overtimes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OvertimeController::store
 * @see app/Http/Controllers/OvertimeController.php:81
 * @route '/overtimes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::store
 * @see app/Http/Controllers/OvertimeController.php:81
 * @route '/overtimes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OvertimeController::show
 * @see app/Http/Controllers/OvertimeController.php:126
 * @route '/overtimes/{overtime}'
 */
export const show = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/overtimes/{overtime}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OvertimeController::show
 * @see app/Http/Controllers/OvertimeController.php:126
 * @route '/overtimes/{overtime}'
 */
show.url = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { overtime: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { overtime: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    overtime: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        overtime: typeof args.overtime === 'object'
                ? args.overtime.id
                : args.overtime,
                }

    return show.definition.url
            .replace('{overtime}', parsedArgs.overtime.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::show
 * @see app/Http/Controllers/OvertimeController.php:126
 * @route '/overtimes/{overtime}'
 */
show.get = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OvertimeController::show
 * @see app/Http/Controllers/OvertimeController.php:126
 * @route '/overtimes/{overtime}'
 */
show.head = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OvertimeController::show
 * @see app/Http/Controllers/OvertimeController.php:126
 * @route '/overtimes/{overtime}'
 */
    const showForm = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::show
 * @see app/Http/Controllers/OvertimeController.php:126
 * @route '/overtimes/{overtime}'
 */
        showForm.get = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OvertimeController::show
 * @see app/Http/Controllers/OvertimeController.php:126
 * @route '/overtimes/{overtime}'
 */
        showForm.head = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OvertimeController::approve
 * @see app/Http/Controllers/OvertimeController.php:140
 * @route '/overtimes/{overtime}/approve'
 */
export const approve = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/overtimes/{overtime}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OvertimeController::approve
 * @see app/Http/Controllers/OvertimeController.php:140
 * @route '/overtimes/{overtime}/approve'
 */
approve.url = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { overtime: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { overtime: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    overtime: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        overtime: typeof args.overtime === 'object'
                ? args.overtime.id
                : args.overtime,
                }

    return approve.definition.url
            .replace('{overtime}', parsedArgs.overtime.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::approve
 * @see app/Http/Controllers/OvertimeController.php:140
 * @route '/overtimes/{overtime}/approve'
 */
approve.post = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OvertimeController::approve
 * @see app/Http/Controllers/OvertimeController.php:140
 * @route '/overtimes/{overtime}/approve'
 */
    const approveForm = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::approve
 * @see app/Http/Controllers/OvertimeController.php:140
 * @route '/overtimes/{overtime}/approve'
 */
        approveForm.post = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\OvertimeController::reject
 * @see app/Http/Controllers/OvertimeController.php:185
 * @route '/overtimes/{overtime}/reject'
 */
export const reject = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/overtimes/{overtime}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OvertimeController::reject
 * @see app/Http/Controllers/OvertimeController.php:185
 * @route '/overtimes/{overtime}/reject'
 */
reject.url = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { overtime: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { overtime: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    overtime: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        overtime: typeof args.overtime === 'object'
                ? args.overtime.id
                : args.overtime,
                }

    return reject.definition.url
            .replace('{overtime}', parsedArgs.overtime.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::reject
 * @see app/Http/Controllers/OvertimeController.php:185
 * @route '/overtimes/{overtime}/reject'
 */
reject.post = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OvertimeController::reject
 * @see app/Http/Controllers/OvertimeController.php:185
 * @route '/overtimes/{overtime}/reject'
 */
    const rejectForm = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::reject
 * @see app/Http/Controllers/OvertimeController.php:185
 * @route '/overtimes/{overtime}/reject'
 */
        rejectForm.post = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\OvertimeController::pdf
 * @see app/Http/Controllers/OvertimeController.php:220
 * @route '/overtimes/{overtime}/pdf'
 */
export const pdf = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/overtimes/{overtime}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OvertimeController::pdf
 * @see app/Http/Controllers/OvertimeController.php:220
 * @route '/overtimes/{overtime}/pdf'
 */
pdf.url = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { overtime: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { overtime: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    overtime: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        overtime: typeof args.overtime === 'object'
                ? args.overtime.id
                : args.overtime,
                }

    return pdf.definition.url
            .replace('{overtime}', parsedArgs.overtime.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::pdf
 * @see app/Http/Controllers/OvertimeController.php:220
 * @route '/overtimes/{overtime}/pdf'
 */
pdf.get = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OvertimeController::pdf
 * @see app/Http/Controllers/OvertimeController.php:220
 * @route '/overtimes/{overtime}/pdf'
 */
pdf.head = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OvertimeController::pdf
 * @see app/Http/Controllers/OvertimeController.php:220
 * @route '/overtimes/{overtime}/pdf'
 */
    const pdfForm = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::pdf
 * @see app/Http/Controllers/OvertimeController.php:220
 * @route '/overtimes/{overtime}/pdf'
 */
        pdfForm.get = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OvertimeController::pdf
 * @see app/Http/Controllers/OvertimeController.php:220
 * @route '/overtimes/{overtime}/pdf'
 */
        pdfForm.head = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
/**
* @see \App\Http\Controllers\OvertimeController::whatsappUrl
 * @see app/Http/Controllers/OvertimeController.php:235
 * @route '/overtimes/{overtime}/whatsapp-url'
 */
export const whatsappUrl = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappUrl.url(args, options),
    method: 'get',
})

whatsappUrl.definition = {
    methods: ["get","head"],
    url: '/overtimes/{overtime}/whatsapp-url',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OvertimeController::whatsappUrl
 * @see app/Http/Controllers/OvertimeController.php:235
 * @route '/overtimes/{overtime}/whatsapp-url'
 */
whatsappUrl.url = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { overtime: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { overtime: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    overtime: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        overtime: typeof args.overtime === 'object'
                ? args.overtime.id
                : args.overtime,
                }

    return whatsappUrl.definition.url
            .replace('{overtime}', parsedArgs.overtime.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OvertimeController::whatsappUrl
 * @see app/Http/Controllers/OvertimeController.php:235
 * @route '/overtimes/{overtime}/whatsapp-url'
 */
whatsappUrl.get = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappUrl.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OvertimeController::whatsappUrl
 * @see app/Http/Controllers/OvertimeController.php:235
 * @route '/overtimes/{overtime}/whatsapp-url'
 */
whatsappUrl.head = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: whatsappUrl.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OvertimeController::whatsappUrl
 * @see app/Http/Controllers/OvertimeController.php:235
 * @route '/overtimes/{overtime}/whatsapp-url'
 */
    const whatsappUrlForm = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: whatsappUrl.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OvertimeController::whatsappUrl
 * @see app/Http/Controllers/OvertimeController.php:235
 * @route '/overtimes/{overtime}/whatsapp-url'
 */
        whatsappUrlForm.get = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsappUrl.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OvertimeController::whatsappUrl
 * @see app/Http/Controllers/OvertimeController.php:235
 * @route '/overtimes/{overtime}/whatsapp-url'
 */
        whatsappUrlForm.head = (args: { overtime: number | { id: number } } | [overtime: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: whatsappUrl.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    whatsappUrl.form = whatsappUrlForm
const overtimes = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
pdf: Object.assign(pdf, pdf),
whatsappUrl: Object.assign(whatsappUrl, whatsappUrl),
}

export default overtimes