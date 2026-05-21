import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollController::index
 * @see app/Http/Controllers/PayrollController.php:46
 * @route '/payrolls'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payrolls',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::index
 * @see app/Http/Controllers/PayrollController.php:46
 * @route '/payrolls'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::index
 * @see app/Http/Controllers/PayrollController.php:46
 * @route '/payrolls'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::index
 * @see app/Http/Controllers/PayrollController.php:46
 * @route '/payrolls'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::index
 * @see app/Http/Controllers/PayrollController.php:46
 * @route '/payrolls'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::index
 * @see app/Http/Controllers/PayrollController.php:46
 * @route '/payrolls'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::index
 * @see app/Http/Controllers/PayrollController.php:46
 * @route '/payrolls'
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
* @see \App\Http\Controllers\PayrollController::generate
 * @see app/Http/Controllers/PayrollController.php:60
 * @route '/payrolls/generate'
 */
export const generate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

generate.definition = {
    methods: ["post"],
    url: '/payrolls/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollController::generate
 * @see app/Http/Controllers/PayrollController.php:60
 * @route '/payrolls/generate'
 */
generate.url = (options?: RouteQueryOptions) => {
    return generate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::generate
 * @see app/Http/Controllers/PayrollController.php:60
 * @route '/payrolls/generate'
 */
generate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollController::generate
 * @see app/Http/Controllers/PayrollController.php:60
 * @route '/payrolls/generate'
 */
    const generateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollController::generate
 * @see app/Http/Controllers/PayrollController.php:60
 * @route '/payrolls/generate'
 */
        generateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generate.url(options),
            method: 'post',
        })
    
    generate.form = generateForm
/**
* @see \App\Http\Controllers\PayrollController::finalize
 * @see app/Http/Controllers/PayrollController.php:108
 * @route '/payrolls/{payroll}/finalize'
 */
export const finalize = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

finalize.definition = {
    methods: ["post"],
    url: '/payrolls/{payroll}/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollController::finalize
 * @see app/Http/Controllers/PayrollController.php:108
 * @route '/payrolls/{payroll}/finalize'
 */
finalize.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return finalize.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::finalize
 * @see app/Http/Controllers/PayrollController.php:108
 * @route '/payrolls/{payroll}/finalize'
 */
finalize.post = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollController::finalize
 * @see app/Http/Controllers/PayrollController.php:108
 * @route '/payrolls/{payroll}/finalize'
 */
    const finalizeForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalize.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollController::finalize
 * @see app/Http/Controllers/PayrollController.php:108
 * @route '/payrolls/{payroll}/finalize'
 */
        finalizeForm.post = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalize.url(args, options),
            method: 'post',
        })
    
    finalize.form = finalizeForm
/**
* @see \App\Http\Controllers\PayrollController::exportExcel
 * @see app/Http/Controllers/PayrollController.php:211
 * @route '/payrolls/{payroll}/export-excel'
 */
export const exportExcel = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(args, options),
    method: 'get',
})

exportExcel.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}/export-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::exportExcel
 * @see app/Http/Controllers/PayrollController.php:211
 * @route '/payrolls/{payroll}/export-excel'
 */
exportExcel.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return exportExcel.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::exportExcel
 * @see app/Http/Controllers/PayrollController.php:211
 * @route '/payrolls/{payroll}/export-excel'
 */
exportExcel.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::exportExcel
 * @see app/Http/Controllers/PayrollController.php:211
 * @route '/payrolls/{payroll}/export-excel'
 */
exportExcel.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::exportExcel
 * @see app/Http/Controllers/PayrollController.php:211
 * @route '/payrolls/{payroll}/export-excel'
 */
    const exportExcelForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportExcel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::exportExcel
 * @see app/Http/Controllers/PayrollController.php:211
 * @route '/payrolls/{payroll}/export-excel'
 */
        exportExcelForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportExcel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::exportExcel
 * @see app/Http/Controllers/PayrollController.php:211
 * @route '/payrolls/{payroll}/export-excel'
 */
        exportExcelForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportExcel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportExcel.form = exportExcelForm
/**
* @see \App\Http\Controllers\PayrollController::exportPdfReport
 * @see app/Http/Controllers/PayrollController.php:221
 * @route '/payrolls/{payroll}/export-pdf-report'
 */
export const exportPdfReport = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdfReport.url(args, options),
    method: 'get',
})

exportPdfReport.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}/export-pdf-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::exportPdfReport
 * @see app/Http/Controllers/PayrollController.php:221
 * @route '/payrolls/{payroll}/export-pdf-report'
 */
exportPdfReport.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return exportPdfReport.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::exportPdfReport
 * @see app/Http/Controllers/PayrollController.php:221
 * @route '/payrolls/{payroll}/export-pdf-report'
 */
exportPdfReport.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdfReport.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::exportPdfReport
 * @see app/Http/Controllers/PayrollController.php:221
 * @route '/payrolls/{payroll}/export-pdf-report'
 */
exportPdfReport.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdfReport.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::exportPdfReport
 * @see app/Http/Controllers/PayrollController.php:221
 * @route '/payrolls/{payroll}/export-pdf-report'
 */
    const exportPdfReportForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPdfReport.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::exportPdfReport
 * @see app/Http/Controllers/PayrollController.php:221
 * @route '/payrolls/{payroll}/export-pdf-report'
 */
        exportPdfReportForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdfReport.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::exportPdfReport
 * @see app/Http/Controllers/PayrollController.php:221
 * @route '/payrolls/{payroll}/export-pdf-report'
 */
        exportPdfReportForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdfReport.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPdfReport.form = exportPdfReportForm
/**
* @see \App\Http\Controllers\PayrollController::exportUangMakanLembur
 * @see app/Http/Controllers/PayrollController.php:249
 * @route '/payrolls/{payroll}/export-uang-makan-lembur'
 */
export const exportUangMakanLembur = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportUangMakanLembur.url(args, options),
    method: 'get',
})

exportUangMakanLembur.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}/export-uang-makan-lembur',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::exportUangMakanLembur
 * @see app/Http/Controllers/PayrollController.php:249
 * @route '/payrolls/{payroll}/export-uang-makan-lembur'
 */
exportUangMakanLembur.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return exportUangMakanLembur.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::exportUangMakanLembur
 * @see app/Http/Controllers/PayrollController.php:249
 * @route '/payrolls/{payroll}/export-uang-makan-lembur'
 */
exportUangMakanLembur.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportUangMakanLembur.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::exportUangMakanLembur
 * @see app/Http/Controllers/PayrollController.php:249
 * @route '/payrolls/{payroll}/export-uang-makan-lembur'
 */
exportUangMakanLembur.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportUangMakanLembur.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::exportUangMakanLembur
 * @see app/Http/Controllers/PayrollController.php:249
 * @route '/payrolls/{payroll}/export-uang-makan-lembur'
 */
    const exportUangMakanLemburForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportUangMakanLembur.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::exportUangMakanLembur
 * @see app/Http/Controllers/PayrollController.php:249
 * @route '/payrolls/{payroll}/export-uang-makan-lembur'
 */
        exportUangMakanLemburForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportUangMakanLembur.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::exportUangMakanLembur
 * @see app/Http/Controllers/PayrollController.php:249
 * @route '/payrolls/{payroll}/export-uang-makan-lembur'
 */
        exportUangMakanLemburForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportUangMakanLembur.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportUangMakanLembur.form = exportUangMakanLemburForm
/**
* @see \App\Http\Controllers\PayrollController::exportBpjs
 * @see app/Http/Controllers/PayrollController.php:272
 * @route '/payrolls/{payroll}/export-bpjs'
 */
export const exportBpjs = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportBpjs.url(args, options),
    method: 'get',
})

exportBpjs.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}/export-bpjs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::exportBpjs
 * @see app/Http/Controllers/PayrollController.php:272
 * @route '/payrolls/{payroll}/export-bpjs'
 */
exportBpjs.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return exportBpjs.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::exportBpjs
 * @see app/Http/Controllers/PayrollController.php:272
 * @route '/payrolls/{payroll}/export-bpjs'
 */
exportBpjs.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportBpjs.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::exportBpjs
 * @see app/Http/Controllers/PayrollController.php:272
 * @route '/payrolls/{payroll}/export-bpjs'
 */
exportBpjs.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportBpjs.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::exportBpjs
 * @see app/Http/Controllers/PayrollController.php:272
 * @route '/payrolls/{payroll}/export-bpjs'
 */
    const exportBpjsForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportBpjs.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::exportBpjs
 * @see app/Http/Controllers/PayrollController.php:272
 * @route '/payrolls/{payroll}/export-bpjs'
 */
        exportBpjsForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportBpjs.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::exportBpjs
 * @see app/Http/Controllers/PayrollController.php:272
 * @route '/payrolls/{payroll}/export-bpjs'
 */
        exportBpjsForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportBpjs.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportBpjs.form = exportBpjsForm
/**
* @see \App\Http\Controllers\PayrollController::exportPph21
 * @see app/Http/Controllers/PayrollController.php:295
 * @route '/payrolls/{payroll}/export-pph21'
 */
export const exportPph21 = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPph21.url(args, options),
    method: 'get',
})

exportPph21.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}/export-pph21',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::exportPph21
 * @see app/Http/Controllers/PayrollController.php:295
 * @route '/payrolls/{payroll}/export-pph21'
 */
exportPph21.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return exportPph21.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::exportPph21
 * @see app/Http/Controllers/PayrollController.php:295
 * @route '/payrolls/{payroll}/export-pph21'
 */
exportPph21.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPph21.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::exportPph21
 * @see app/Http/Controllers/PayrollController.php:295
 * @route '/payrolls/{payroll}/export-pph21'
 */
exportPph21.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPph21.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::exportPph21
 * @see app/Http/Controllers/PayrollController.php:295
 * @route '/payrolls/{payroll}/export-pph21'
 */
    const exportPph21Form = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPph21.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::exportPph21
 * @see app/Http/Controllers/PayrollController.php:295
 * @route '/payrolls/{payroll}/export-pph21'
 */
        exportPph21Form.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPph21.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::exportPph21
 * @see app/Http/Controllers/PayrollController.php:295
 * @route '/payrolls/{payroll}/export-pph21'
 */
        exportPph21Form.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPph21.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPph21.form = exportPph21Form
/**
* @see \App\Http\Controllers\PayrollController::exportAttendance
 * @see app/Http/Controllers/PayrollController.php:318
 * @route '/payrolls/{payroll}/export-attendance'
 */
export const exportAttendance = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportAttendance.url(args, options),
    method: 'get',
})

exportAttendance.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}/export-attendance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::exportAttendance
 * @see app/Http/Controllers/PayrollController.php:318
 * @route '/payrolls/{payroll}/export-attendance'
 */
exportAttendance.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return exportAttendance.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::exportAttendance
 * @see app/Http/Controllers/PayrollController.php:318
 * @route '/payrolls/{payroll}/export-attendance'
 */
exportAttendance.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportAttendance.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::exportAttendance
 * @see app/Http/Controllers/PayrollController.php:318
 * @route '/payrolls/{payroll}/export-attendance'
 */
exportAttendance.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportAttendance.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::exportAttendance
 * @see app/Http/Controllers/PayrollController.php:318
 * @route '/payrolls/{payroll}/export-attendance'
 */
    const exportAttendanceForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportAttendance.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::exportAttendance
 * @see app/Http/Controllers/PayrollController.php:318
 * @route '/payrolls/{payroll}/export-attendance'
 */
        exportAttendanceForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportAttendance.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::exportAttendance
 * @see app/Http/Controllers/PayrollController.php:318
 * @route '/payrolls/{payroll}/export-attendance'
 */
        exportAttendanceForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportAttendance.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportAttendance.form = exportAttendanceForm
/**
* @see \App\Http\Controllers\PayrollController::show
 * @see app/Http/Controllers/PayrollController.php:84
 * @route '/payrolls/{payroll}'
 */
export const show = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::show
 * @see app/Http/Controllers/PayrollController.php:84
 * @route '/payrolls/{payroll}'
 */
show.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return show.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::show
 * @see app/Http/Controllers/PayrollController.php:84
 * @route '/payrolls/{payroll}'
 */
show.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::show
 * @see app/Http/Controllers/PayrollController.php:84
 * @route '/payrolls/{payroll}'
 */
show.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::show
 * @see app/Http/Controllers/PayrollController.php:84
 * @route '/payrolls/{payroll}'
 */
    const showForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::show
 * @see app/Http/Controllers/PayrollController.php:84
 * @route '/payrolls/{payroll}'
 */
        showForm.get = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::show
 * @see app/Http/Controllers/PayrollController.php:84
 * @route '/payrolls/{payroll}'
 */
        showForm.head = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PayrollController::destroy
 * @see app/Http/Controllers/PayrollController.php:95
 * @route '/payrolls/{payroll}'
 */
export const destroy = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payrolls/{payroll}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollController::destroy
 * @see app/Http/Controllers/PayrollController.php:95
 * @route '/payrolls/{payroll}'
 */
destroy.url = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payroll: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                }

    return destroy.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::destroy
 * @see app/Http/Controllers/PayrollController.php:95
 * @route '/payrolls/{payroll}'
 */
destroy.delete = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PayrollController::destroy
 * @see app/Http/Controllers/PayrollController.php:95
 * @route '/payrolls/{payroll}'
 */
    const destroyForm = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollController::destroy
 * @see app/Http/Controllers/PayrollController.php:95
 * @route '/payrolls/{payroll}'
 */
        destroyForm.delete = (args: { payroll: number | { id: number } } | [payroll: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollController::pdf
 * @see app/Http/Controllers/PayrollController.php:181
 * @route '/payrolls/{payroll}/items/{item}/pdf'
 */
export const pdf = (args: { payroll: number | { id: number }, item: number | { id: number } } | [payroll: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/payrolls/{payroll}/items/{item}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::pdf
 * @see app/Http/Controllers/PayrollController.php:181
 * @route '/payrolls/{payroll}/items/{item}/pdf'
 */
pdf.url = (args: { payroll: number | { id: number }, item: number | { id: number } } | [payroll: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    payroll: args[0],
                    item: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll: typeof args.payroll === 'object'
                ? args.payroll.id
                : args.payroll,
                                item: typeof args.item === 'object'
                ? args.item.id
                : args.item,
                }

    return pdf.definition.url
            .replace('{payroll}', parsedArgs.payroll.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::pdf
 * @see app/Http/Controllers/PayrollController.php:181
 * @route '/payrolls/{payroll}/items/{item}/pdf'
 */
pdf.get = (args: { payroll: number | { id: number }, item: number | { id: number } } | [payroll: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::pdf
 * @see app/Http/Controllers/PayrollController.php:181
 * @route '/payrolls/{payroll}/items/{item}/pdf'
 */
pdf.head = (args: { payroll: number | { id: number }, item: number | { id: number } } | [payroll: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::pdf
 * @see app/Http/Controllers/PayrollController.php:181
 * @route '/payrolls/{payroll}/items/{item}/pdf'
 */
    const pdfForm = (args: { payroll: number | { id: number }, item: number | { id: number } } | [payroll: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::pdf
 * @see app/Http/Controllers/PayrollController.php:181
 * @route '/payrolls/{payroll}/items/{item}/pdf'
 */
        pdfForm.get = (args: { payroll: number | { id: number }, item: number | { id: number } } | [payroll: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::pdf
 * @see app/Http/Controllers/PayrollController.php:181
 * @route '/payrolls/{payroll}/items/{item}/pdf'
 */
        pdfForm.head = (args: { payroll: number | { id: number }, item: number | { id: number } } | [payroll: number | { id: number }, item: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PayrollController::me
 * @see app/Http/Controllers/PayrollController.php:19
 * @route '/my-payroll'
 */
export const me = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})

me.definition = {
    methods: ["get","head"],
    url: '/my-payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollController::me
 * @see app/Http/Controllers/PayrollController.php:19
 * @route '/my-payroll'
 */
me.url = (options?: RouteQueryOptions) => {
    return me.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollController::me
 * @see app/Http/Controllers/PayrollController.php:19
 * @route '/my-payroll'
 */
me.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: me.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollController::me
 * @see app/Http/Controllers/PayrollController.php:19
 * @route '/my-payroll'
 */
me.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: me.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollController::me
 * @see app/Http/Controllers/PayrollController.php:19
 * @route '/my-payroll'
 */
    const meForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: me.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollController::me
 * @see app/Http/Controllers/PayrollController.php:19
 * @route '/my-payroll'
 */
        meForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: me.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollController::me
 * @see app/Http/Controllers/PayrollController.php:19
 * @route '/my-payroll'
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
const payrolls = {
    index: Object.assign(index, index),
generate: Object.assign(generate, generate),
finalize: Object.assign(finalize, finalize),
exportExcel: Object.assign(exportExcel, exportExcel),
exportPdfReport: Object.assign(exportPdfReport, exportPdfReport),
exportUangMakanLembur: Object.assign(exportUangMakanLembur, exportUangMakanLembur),
exportBpjs: Object.assign(exportBpjs, exportBpjs),
exportPph21: Object.assign(exportPph21, exportPph21),
exportAttendance: Object.assign(exportAttendance, exportAttendance),
show: Object.assign(show, show),
destroy: Object.assign(destroy, destroy),
pdf: Object.assign(pdf, pdf),
me: Object.assign(me, me),
}

export default payrolls