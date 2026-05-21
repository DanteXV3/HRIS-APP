import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WarningLetterController::index
 * @see app/Http/Controllers/WarningLetterController.php:14
 * @route '/warning-letters'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/warning-letters',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarningLetterController::index
 * @see app/Http/Controllers/WarningLetterController.php:14
 * @route '/warning-letters'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::index
 * @see app/Http/Controllers/WarningLetterController.php:14
 * @route '/warning-letters'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarningLetterController::index
 * @see app/Http/Controllers/WarningLetterController.php:14
 * @route '/warning-letters'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::index
 * @see app/Http/Controllers/WarningLetterController.php:14
 * @route '/warning-letters'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::index
 * @see app/Http/Controllers/WarningLetterController.php:14
 * @route '/warning-letters'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarningLetterController::index
 * @see app/Http/Controllers/WarningLetterController.php:14
 * @route '/warning-letters'
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
* @see \App\Http\Controllers\WarningLetterController::create
 * @see app/Http/Controllers/WarningLetterController.php:42
 * @route '/warning-letters/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/warning-letters/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarningLetterController::create
 * @see app/Http/Controllers/WarningLetterController.php:42
 * @route '/warning-letters/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::create
 * @see app/Http/Controllers/WarningLetterController.php:42
 * @route '/warning-letters/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarningLetterController::create
 * @see app/Http/Controllers/WarningLetterController.php:42
 * @route '/warning-letters/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::create
 * @see app/Http/Controllers/WarningLetterController.php:42
 * @route '/warning-letters/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::create
 * @see app/Http/Controllers/WarningLetterController.php:42
 * @route '/warning-letters/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarningLetterController::create
 * @see app/Http/Controllers/WarningLetterController.php:42
 * @route '/warning-letters/create'
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
* @see \App\Http\Controllers\WarningLetterController::store
 * @see app/Http/Controllers/WarningLetterController.php:53
 * @route '/warning-letters'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/warning-letters',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WarningLetterController::store
 * @see app/Http/Controllers/WarningLetterController.php:53
 * @route '/warning-letters'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::store
 * @see app/Http/Controllers/WarningLetterController.php:53
 * @route '/warning-letters'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::store
 * @see app/Http/Controllers/WarningLetterController.php:53
 * @route '/warning-letters'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::store
 * @see app/Http/Controllers/WarningLetterController.php:53
 * @route '/warning-letters'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WarningLetterController::show
 * @see app/Http/Controllers/WarningLetterController.php:102
 * @route '/warning-letters/{warning_letter}'
 */
export const show = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/warning-letters/{warning_letter}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarningLetterController::show
 * @see app/Http/Controllers/WarningLetterController.php:102
 * @route '/warning-letters/{warning_letter}'
 */
show.url = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warning_letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    warning_letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warning_letter: args.warning_letter,
                }

    return show.definition.url
            .replace('{warning_letter}', parsedArgs.warning_letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::show
 * @see app/Http/Controllers/WarningLetterController.php:102
 * @route '/warning-letters/{warning_letter}'
 */
show.get = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarningLetterController::show
 * @see app/Http/Controllers/WarningLetterController.php:102
 * @route '/warning-letters/{warning_letter}'
 */
show.head = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::show
 * @see app/Http/Controllers/WarningLetterController.php:102
 * @route '/warning-letters/{warning_letter}'
 */
    const showForm = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::show
 * @see app/Http/Controllers/WarningLetterController.php:102
 * @route '/warning-letters/{warning_letter}'
 */
        showForm.get = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarningLetterController::show
 * @see app/Http/Controllers/WarningLetterController.php:102
 * @route '/warning-letters/{warning_letter}'
 */
        showForm.head = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WarningLetterController::edit
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}/edit'
 */
export const edit = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/warning-letters/{warning_letter}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarningLetterController::edit
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}/edit'
 */
edit.url = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warning_letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    warning_letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warning_letter: args.warning_letter,
                }

    return edit.definition.url
            .replace('{warning_letter}', parsedArgs.warning_letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::edit
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}/edit'
 */
edit.get = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarningLetterController::edit
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}/edit'
 */
edit.head = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::edit
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}/edit'
 */
    const editForm = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::edit
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}/edit'
 */
        editForm.get = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarningLetterController::edit
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}/edit'
 */
        editForm.head = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WarningLetterController::update
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}'
 */
export const update = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/warning-letters/{warning_letter}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WarningLetterController::update
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}'
 */
update.url = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warning_letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    warning_letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warning_letter: args.warning_letter,
                }

    return update.definition.url
            .replace('{warning_letter}', parsedArgs.warning_letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::update
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}'
 */
update.put = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\WarningLetterController::update
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}'
 */
update.patch = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::update
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}'
 */
    const updateForm = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::update
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}'
 */
        updateForm.put = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\WarningLetterController::update
 * @see app/Http/Controllers/WarningLetterController.php:0
 * @route '/warning-letters/{warning_letter}'
 */
        updateForm.patch = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\WarningLetterController::destroy
 * @see app/Http/Controllers/WarningLetterController.php:120
 * @route '/warning-letters/{warning_letter}'
 */
export const destroy = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/warning-letters/{warning_letter}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WarningLetterController::destroy
 * @see app/Http/Controllers/WarningLetterController.php:120
 * @route '/warning-letters/{warning_letter}'
 */
destroy.url = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warning_letter: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    warning_letter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warning_letter: args.warning_letter,
                }

    return destroy.definition.url
            .replace('{warning_letter}', parsedArgs.warning_letter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::destroy
 * @see app/Http/Controllers/WarningLetterController.php:120
 * @route '/warning-letters/{warning_letter}'
 */
destroy.delete = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::destroy
 * @see app/Http/Controllers/WarningLetterController.php:120
 * @route '/warning-letters/{warning_letter}'
 */
    const destroyForm = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::destroy
 * @see app/Http/Controllers/WarningLetterController.php:120
 * @route '/warning-letters/{warning_letter}'
 */
        destroyForm.delete = (args: { warning_letter: string | number } | [warning_letter: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\WarningLetterController::pdf
 * @see app/Http/Controllers/WarningLetterController.php:130
 * @route '/warning-letters/{warningLetter}/pdf'
 */
export const pdf = (args: { warningLetter: number | { id: number } } | [warningLetter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/warning-letters/{warningLetter}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WarningLetterController::pdf
 * @see app/Http/Controllers/WarningLetterController.php:130
 * @route '/warning-letters/{warningLetter}/pdf'
 */
pdf.url = (args: { warningLetter: number | { id: number } } | [warningLetter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { warningLetter: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { warningLetter: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    warningLetter: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        warningLetter: typeof args.warningLetter === 'object'
                ? args.warningLetter.id
                : args.warningLetter,
                }

    return pdf.definition.url
            .replace('{warningLetter}', parsedArgs.warningLetter.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WarningLetterController::pdf
 * @see app/Http/Controllers/WarningLetterController.php:130
 * @route '/warning-letters/{warningLetter}/pdf'
 */
pdf.get = (args: { warningLetter: number | { id: number } } | [warningLetter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WarningLetterController::pdf
 * @see app/Http/Controllers/WarningLetterController.php:130
 * @route '/warning-letters/{warningLetter}/pdf'
 */
pdf.head = (args: { warningLetter: number | { id: number } } | [warningLetter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WarningLetterController::pdf
 * @see app/Http/Controllers/WarningLetterController.php:130
 * @route '/warning-letters/{warningLetter}/pdf'
 */
    const pdfForm = (args: { warningLetter: number | { id: number } } | [warningLetter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WarningLetterController::pdf
 * @see app/Http/Controllers/WarningLetterController.php:130
 * @route '/warning-letters/{warningLetter}/pdf'
 */
        pdfForm.get = (args: { warningLetter: number | { id: number } } | [warningLetter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WarningLetterController::pdf
 * @see app/Http/Controllers/WarningLetterController.php:130
 * @route '/warning-letters/{warningLetter}/pdf'
 */
        pdfForm.head = (args: { warningLetter: number | { id: number } } | [warningLetter: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
const warningLetters = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
pdf: Object.assign(pdf, pdf),
}

export default warningLetters