import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface SecurityPatrolArea {
    id: number;
    working_location_id: number;
    name: string;
    sequence: number;
    is_active: boolean;
}

interface WorkingLocation {
    id: number;
    name: string;
    security_patrol_areas?: SecurityPatrolArea[];
}

interface Props {
    workingLocations: WorkingLocation[];
}

export default function SecurityAreasIndex({ workingLocations }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Security Settings', href: '/security/patrol-areas' },
    ];

    const [editingArea, setEditingArea] = useState<SecurityPatrolArea | null>(null);
    const [addingToLocation, setAddingToLocation] = useState<number | null>(null);

    const { data: addData, setData: setAddData, post: postAdd, reset: resetAdd, processing: isAdding } = useForm({
        working_location_id: 0,
        name: '',
        sequence: 0,
        is_active: true,
    });

    const { data: editData, setData: setEditData, put: putEdit, processing: isEditing } = useForm({
        name: '',
        sequence: 0,
        is_active: true,
    });

    const { delete: destroy } = useForm();

    const startAdd = (locationId: number) => {
        setAddingToLocation(locationId);
        setEditingArea(null);
        setAddData({
            working_location_id: locationId,
            name: '',
            sequence: 0,
            is_active: true,
        });
    };

    const cancelAdd = () => {
        setAddingToLocation(null);
        resetAdd();
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        postAdd('/security/patrol-areas', {
            preserveScroll: true,
            onSuccess: () => setAddingToLocation(null),
        });
    };

    const startEdit = (area: SecurityPatrolArea) => {
        setEditingArea(area);
        setAddingToLocation(null);
        setEditData({
            name: area.name,
            sequence: area.sequence,
            is_active: area.is_active,
        });
    };

    const cancelEdit = () => {
        setEditingArea(null);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        putEdit(`/security/patrol-areas/${editingArea?.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingArea(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this patrol area?')) {
            destroy(`/security/patrol-areas/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Security Patrol Settings" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Security Patrol Areas</h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage the physical locations guards must patrol per facility.</p>
                </div>

                <div className="space-y-6">
                    {workingLocations.map((location) => (
                        <div key={location.id} className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-800/50">
                                <div>
                                    <h2 className="font-semibold text-lg text-neutral-900 dark:text-white">{location.name}</h2>
                                    <p className="text-xs text-neutral-500">{(location.security_patrol_areas || []).length} registered areas</p>
                                </div>
                                <button
                                    onClick={() => startAdd(location.id)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Area
                                </button>
                            </div>

                            <div className="p-0">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                                            <th className="px-6 py-3 font-semibold w-16 text-center">Seq</th>
                                            <th className="px-6 py-3 font-semibold">Area Name</th>
                                            <th className="px-6 py-3 font-semibold w-24 text-center">Status</th>
                                            <th className="px-6 py-3 font-semibold w-24 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                                        {(location.security_patrol_areas || []).map(area => (
                                            <tr key={area.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                {editingArea?.id === area.id ? (
                                                    <td colSpan={4} className="px-6 py-3 bg-blue-50/50 dark:bg-blue-900/10">
                                                        <form onSubmit={submitEdit} className="flex gap-4 items-center">
                                                            <input
                                                                type="number"
                                                                value={editData.sequence}
                                                                onChange={e => setEditData('sequence', parseInt(e.target.value))}
                                                                className="w-16 rounded border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 text-sm"
                                                                placeholder="Seq"
                                                            />
                                                            <input
                                                                type="text"
                                                                required
                                                                value={editData.name}
                                                                onChange={e => setEditData('name', e.target.value)}
                                                                className="flex-1 rounded border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 text-sm"
                                                                placeholder="Area Name"
                                                            />
                                                            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editData.is_active}
                                                                    onChange={e => setEditData('is_active', e.target.checked)}
                                                                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                Active
                                                            </label>
                                                            <div className="flex gap-2 justify-end min-w-[100px]">
                                                                <button type="button" onClick={cancelEdit} className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                                <button type="submit" disabled={isEditing} className="p-1.5 text-green-600 hover:text-green-700">
                                                                    <Save className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </td>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-3 text-center text-neutral-500 font-mono">{area.sequence}</td>
                                                        <td className="px-6 py-3 font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                                                            <ShieldCheck className="w-4 h-4 text-neutral-400" />
                                                            {area.name}
                                                        </td>
                                                        <td className="px-6 py-3 text-center">
                                                            <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${area.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                                                                {area.is_active ? 'Active' : 'Disabled'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            <div className="flex justify-end gap-1">
                                                                <button onClick={() => startEdit(area)} className="p-1.5 text-neutral-400 hover:text-blue-600 transition-colors">
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleDelete(area.id)} className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                        
                                        {/* Inline Add Row */}
                                        {addingToLocation === location.id && (
                                            <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                                                <td colSpan={4} className="px-6 py-3">
                                                    <form onSubmit={submitAdd} className="flex gap-4 items-center">
                                                        <input
                                                            type="number"
                                                            value={addData.sequence}
                                                            onChange={e => setAddData('sequence', parseInt(e.target.value))}
                                                            className="w-16 rounded border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 text-sm"
                                                            placeholder="Seq"
                                                        />
                                                        <input
                                                            type="text"
                                                            required
                                                            autoFocus
                                                            value={addData.name}
                                                            onChange={e => setAddData('name', e.target.value)}
                                                            className="flex-1 rounded border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 text-sm"
                                                            placeholder="New Area Name..."
                                                        />
                                                        <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                            <input
                                                                type="checkbox"
                                                                checked={addData.is_active}
                                                                onChange={e => setAddData('is_active', e.target.checked)}
                                                                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            Active
                                                        </label>
                                                        <div className="flex gap-2 justify-end min-w-[100px]">
                                                            <button type="button" onClick={cancelAdd} className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                            <button type="submit" disabled={isAdding} className="p-1.5 text-blue-600 hover:text-blue-700">
                                                                <Save className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}

                                        {(!location.security_patrol_areas || location.security_patrol_areas.length === 0) && addingToLocation !== location.id && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 dark:text-neutral-400">
                                                    No areas defined. Guards won't be able to report anything here.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
