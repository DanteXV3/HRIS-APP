import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import me0b53e1 from './me'
/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:188
 * @route '/attendances'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/attendances',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:188
 * @route '/attendances'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:188
 * @route '/attendances'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:188
 * @route '/attendances'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:188
 * @route '/attendances'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:188
 * @route '/attendances'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::index
 * @see app/Http/Controllers/AttendanceController.php:188
 * @route '/attendances'
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
* @see \App\Http\Controllers\AttendanceController::store
 * @see app/Http/Controllers/AttendanceController.php:631
 * @route '/attendances'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/attendances',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::store
 * @see app/Http/Controllers/AttendanceController.php:631
 * @route '/attendances'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::store
 * @see app/Http/Controllers/AttendanceController.php:631
 * @route '/attendances'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::store
 * @see app/Http/Controllers/AttendanceController.php:631
 * @route '/attendances'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::store
 * @see app/Http/Controllers/AttendanceController.php:631
 * @route '/attendances'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AttendanceController::my
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/attendances/my'
 */
export const my = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: my.url(options),
    method: 'get',
})

my.definition = {
    methods: ["get","head"],
    url: '/attendances/my',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::my
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/attendances/my'
 */
my.url = (options?: RouteQueryOptions) => {
    return my.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::my
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/attendances/my'
 */
my.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: my.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::my
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/attendances/my'
 */
my.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: my.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::my
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/attendances/my'
 */
    const myForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: my.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::my
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/attendances/my'
 */
        myForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: my.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::my
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/attendances/my'
 */
        myForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: my.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    my.form = myForm
/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
 * @see app/Http/Controllers/AttendanceController.php:231
 * @route '/attendances/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/attendances/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
 * @see app/Http/Controllers/AttendanceController.php:231
 * @route '/attendances/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
 * @see app/Http/Controllers/AttendanceController.php:231
 * @route '/attendances/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::exportMethod
 * @see app/Http/Controllers/AttendanceController.php:231
 * @route '/attendances/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::exportMethod
 * @see app/Http/Controllers/AttendanceController.php:231
 * @route '/attendances/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::exportMethod
 * @see app/Http/Controllers/AttendanceController.php:231
 * @route '/attendances/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::exportMethod
 * @see app/Http/Controllers/AttendanceController.php:231
 * @route '/attendances/export'
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
* @see \App\Http\Controllers\AttendanceController::exportPdf
 * @see app/Http/Controllers/AttendanceController.php:243
 * @route '/attendances/export-pdf'
 */
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/attendances/export-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::exportPdf
 * @see app/Http/Controllers/AttendanceController.php:243
 * @route '/attendances/export-pdf'
 */
exportPdf.url = (options?: RouteQueryOptions) => {
    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::exportPdf
 * @see app/Http/Controllers/AttendanceController.php:243
 * @route '/attendances/export-pdf'
 */
exportPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::exportPdf
 * @see app/Http/Controllers/AttendanceController.php:243
 * @route '/attendances/export-pdf'
 */
exportPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::exportPdf
 * @see app/Http/Controllers/AttendanceController.php:243
 * @route '/attendances/export-pdf'
 */
    const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::exportPdf
 * @see app/Http/Controllers/AttendanceController.php:243
 * @route '/attendances/export-pdf'
 */
        exportPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::exportPdf
 * @see app/Http/Controllers/AttendanceController.php:243
 * @route '/attendances/export-pdf'
 */
        exportPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPdf.form = exportPdfForm
/**
* @see \App\Http\Controllers\AttendanceController::importMethod
 * @see app/Http/Controllers/AttendanceController.php:408
 * @route '/attendances/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/attendances/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceController::importMethod
 * @see app/Http/Controllers/AttendanceController.php:408
 * @route '/attendances/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::importMethod
 * @see app/Http/Controllers/AttendanceController.php:408
 * @route '/attendances/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceController::importMethod
 * @see app/Http/Controllers/AttendanceController.php:408
 * @route '/attendances/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::importMethod
 * @see app/Http/Controllers/AttendanceController.php:408
 * @route '/attendances/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\AttendanceController::update
 * @see app/Http/Controllers/AttendanceController.php:557
 * @route '/attendances/{attendance}'
 */
export const update = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/attendances/{attendance}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AttendanceController::update
 * @see app/Http/Controllers/AttendanceController.php:557
 * @route '/attendances/{attendance}'
 */
update.url = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { attendance: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    attendance: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance: typeof args.attendance === 'object'
                ? args.attendance.id
                : args.attendance,
                }

    return update.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::update
 * @see app/Http/Controllers/AttendanceController.php:557
 * @route '/attendances/{attendance}'
 */
update.put = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AttendanceController::update
 * @see app/Http/Controllers/AttendanceController.php:557
 * @route '/attendances/{attendance}'
 */
    const updateForm = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::update
 * @see app/Http/Controllers/AttendanceController.php:557
 * @route '/attendances/{attendance}'
 */
        updateForm.put = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AttendanceController::destroy
 * @see app/Http/Controllers/AttendanceController.php:716
 * @route '/attendances/{attendance}'
 */
export const destroy = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/attendances/{attendance}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AttendanceController::destroy
 * @see app/Http/Controllers/AttendanceController.php:716
 * @route '/attendances/{attendance}'
 */
destroy.url = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { attendance: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    attendance: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance: typeof args.attendance === 'object'
                ? args.attendance.id
                : args.attendance,
                }

    return destroy.definition.url
            .replace('{attendance}', parsedArgs.attendance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::destroy
 * @see app/Http/Controllers/AttendanceController.php:716
 * @route '/attendances/{attendance}'
 */
destroy.delete = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AttendanceController::destroy
 * @see app/Http/Controllers/AttendanceController.php:716
 * @route '/attendances/{attendance}'
 */
    const destroyForm = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::destroy
 * @see app/Http/Controllers/AttendanceController.php:716
 * @route '/attendances/{attendance}'
 */
        destroyForm.delete = (args: { attendance: number | { id: number } } | [attendance: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AttendanceController::me
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/my-attendance'
 */
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/my-attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceController::me
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/my-attendance'
 */
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceController::me
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/my-attendance'
 */
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceController::me
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/my-attendance'
 */
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceController::me
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/my-attendance'
 */
    const meForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: me.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceController::me
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/my-attendance'
 */
        meForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceController::me
 * @see app/Http/Controllers/AttendanceController.php:17
 * @route '/my-attendance'
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
const attendances = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
my: Object.assign(my, my),
export: Object.assign(exportMethod, exportMethod),
exportPdf: Object.assign(exportPdf, exportPdf),
import: Object.assign(importMethod, importMethod),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
me: Object.assign(me, me0b53e1),
}

export default attendances