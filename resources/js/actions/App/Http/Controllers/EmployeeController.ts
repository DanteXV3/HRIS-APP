import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeController::exportMethod
 * @see app/Http/Controllers/EmployeeController.php:55
 * @route '/employees/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/employees/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::exportMethod
 * @see app/Http/Controllers/EmployeeController.php:55
 * @route '/employees/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::exportMethod
 * @see app/Http/Controllers/EmployeeController.php:55
 * @route '/employees/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::exportMethod
 * @see app/Http/Controllers/EmployeeController.php:55
 * @route '/employees/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::exportMethod
 * @see app/Http/Controllers/EmployeeController.php:55
 * @route '/employees/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::exportMethod
 * @see app/Http/Controllers/EmployeeController.php:55
 * @route '/employees/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::exportMethod
 * @see app/Http/Controllers/EmployeeController.php:55
 * @route '/employees/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:23
 * @route '/employees'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:23
 * @route '/employees'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:23
 * @route '/employees'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:23
 * @route '/employees'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:23
 * @route '/employees'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:23
 * @route '/employees'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:23
 * @route '/employees'
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
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:63
 * @route '/employees/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employees/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:63
 * @route '/employees/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:63
 * @route '/employees/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:63
 * @route '/employees/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:63
 * @route '/employees/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:63
 * @route '/employees/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:63
 * @route '/employees/create'
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
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:79
 * @route '/employees'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:79
 * @route '/employees'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:79
 * @route '/employees'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:79
 * @route '/employees'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:79
 * @route '/employees'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:130
 * @route '/employees/{employee}'
 */
export const show = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:130
 * @route '/employees/{employee}'
 */
show.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:130
 * @route '/employees/{employee}'
 */
show.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:130
 * @route '/employees/{employee}'
 */
show.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:130
 * @route '/employees/{employee}'
 */
    const showForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:130
 * @route '/employees/{employee}'
 */
        showForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:130
 * @route '/employees/{employee}'
 */
        showForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:145
 * @route '/employees/{employee}/edit'
 */
export const edit = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:145
 * @route '/employees/{employee}/edit'
 */
edit.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return edit.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:145
 * @route '/employees/{employee}/edit'
 */
edit.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:145
 * @route '/employees/{employee}/edit'
 */
edit.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:145
 * @route '/employees/{employee}/edit'
 */
    const editForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:145
 * @route '/employees/{employee}/edit'
 */
        editForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:145
 * @route '/employees/{employee}/edit'
 */
        editForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:163
 * @route '/employees/{employee}'
 */
export const update = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:163
 * @route '/employees/{employee}'
 */
update.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return update.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:163
 * @route '/employees/{employee}'
 */
update.put = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:163
 * @route '/employees/{employee}'
 */
update.patch = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:163
 * @route '/employees/{employee}'
 */
    const updateForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:163
 * @route '/employees/{employee}'
 */
        updateForm.put = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:163
 * @route '/employees/{employee}'
 */
        updateForm.patch = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:217
 * @route '/employees/{employee}'
 */
export const destroy = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:217
 * @route '/employees/{employee}'
 */
destroy.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:217
 * @route '/employees/{employee}'
 */
destroy.delete = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:217
 * @route '/employees/{employee}'
 */
    const destroyForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:217
 * @route '/employees/{employee}'
 */
        destroyForm.delete = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
    const meForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: me.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
        meForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::me
 * @see app/Http/Controllers/EmployeeController.php:235
 * @route '/profile'
 */
        meForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    me.form = meForm
/**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
export const updateMe = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMe.url(options),
    method: 'put',
})

updateMe.definition = {
    methods: ["put"],
    url: '/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
updateMe.url = (options?: RouteQueryOptions) => {
    return updateMe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
updateMe.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMe.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
    const updateMeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateMe.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateMe
 * @see app/Http/Controllers/EmployeeController.php:251
 * @route '/profile'
 */
        updateMeForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateMe.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateMe.form = updateMeForm
/**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
const updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.url(options),
    method: 'post',
})

updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.definition = {
    methods: ["post"],
    url: '/profile/signature',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.url = (options?: RouteQueryOptions) => {
    return updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
    const updateSignatureff1cd46e9ca5fafc4ecf18b7c158420cForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/profile/signature'
 */
        updateSignatureff1cd46e9ca5fafc4ecf18b7c158420cForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.url(options),
            method: 'post',
        })
    
    updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c.form = updateSignatureff1cd46e9ca5fafc4ecf18b7c158420cForm
    /**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/employees/{employee}/signature'
 */
const updateSignaturef61d443ba6ec720f6eb875390411ba53 = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSignaturef61d443ba6ec720f6eb875390411ba53.url(args, options),
    method: 'post',
})

updateSignaturef61d443ba6ec720f6eb875390411ba53.definition = {
    methods: ["post"],
    url: '/employees/{employee}/signature',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/employees/{employee}/signature'
 */
updateSignaturef61d443ba6ec720f6eb875390411ba53.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return updateSignaturef61d443ba6ec720f6eb875390411ba53.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/employees/{employee}/signature'
 */
updateSignaturef61d443ba6ec720f6eb875390411ba53.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSignaturef61d443ba6ec720f6eb875390411ba53.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/employees/{employee}/signature'
 */
    const updateSignaturef61d443ba6ec720f6eb875390411ba53Form = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSignaturef61d443ba6ec720f6eb875390411ba53.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateSignature
 * @see app/Http/Controllers/EmployeeController.php:459
 * @route '/employees/{employee}/signature'
 */
        updateSignaturef61d443ba6ec720f6eb875390411ba53Form.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSignaturef61d443ba6ec720f6eb875390411ba53.url(args, options),
            method: 'post',
        })
    
    updateSignaturef61d443ba6ec720f6eb875390411ba53.form = updateSignaturef61d443ba6ec720f6eb875390411ba53Form

export const updateSignature = {
    '/profile/signature': updateSignatureff1cd46e9ca5fafc4ecf18b7c158420c,
    '/employees/{employee}/signature': updateSignaturef61d443ba6ec720f6eb875390411ba53,
}

/**
* @see \App\Http\Controllers\EmployeeController::updateFaceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
export const updateFaceDescriptor = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateFaceDescriptor.url(options),
    method: 'post',
})

updateFaceDescriptor.definition = {
    methods: ["post"],
    url: '/profile/face-descriptor',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateFaceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
updateFaceDescriptor.url = (options?: RouteQueryOptions) => {
    return updateFaceDescriptor.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateFaceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
updateFaceDescriptor.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateFaceDescriptor.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateFaceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
    const updateFaceDescriptorForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateFaceDescriptor.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateFaceDescriptor
 * @see app/Http/Controllers/EmployeeController.php:494
 * @route '/profile/face-descriptor'
 */
        updateFaceDescriptorForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateFaceDescriptor.url(options),
            method: 'post',
        })
    
    updateFaceDescriptor.form = updateFaceDescriptorForm
const EmployeeController = { exportMethod, index, create, store, show, edit, update, destroy, me, updateMe, updateSignature, updateFaceDescriptor, export: exportMethod }

export default EmployeeController