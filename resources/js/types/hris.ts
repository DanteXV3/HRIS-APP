// === HRIS TypeScript Types ===

export interface Department {
    id: number;
    name: string;
    code: string;
    employees_count?: number;
    positions_count?: number;
    created_at: string;
    updated_at: string;
}

export interface WorkLocation {
    id: number;
    name: string;
    code: string;
    address: string | null;
    payroll_cutoff_date?: number | null;
    employees_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Position {
    id: number;
    name: string;
    department_id: number;
    grade: 'staff' | 'supervisor' | 'manager';
    department?: Department;
    employees_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Employee {
    id: number;
    user_id: number | null;
    // Data Pribadi
    nama: string;
    nik: string;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    alamat_tetap: string | null;
    alamat_sekarang: string | null;
    email: string;
    gender: 'laki-laki' | 'perempuan' | null;
    status_pernikahan: string | null;
    pendidikan_terakhir: string | null;
    agama: string | null;
    no_telpon_1: string | null;
    no_telpon_2: string | null;
    photo: string | null;
    // Identity
    no_ktp: string | null;
    npwp: string | null;
    no_bpjs_ketenagakerjaan: string | null;
    no_bpjs_kesehatan: string | null;
    file_ktp: string | null;
    file_npwp: string | null;
    file_kk: string | null;
    file_ijazah: string | null;
    file_lainnya: string[] | null;
    face_descriptor?: string | null;
    // Employment
    department_id: number;
    position_id: number;
    work_location_id: number | null;
    shift_id: number | null;
    status_kepegawaian: 'tetap' | 'kontrak' | 'probation' | 'magang';
    lokasi_kerja?: string | null;
    hire_date: string;
    end_date: string | null;
    is_active: boolean;
    // Banking
    nama_bank: string | null;
    cabang_bank: string | null;
    no_rekening: string | null;
    nama_rekening: string | null;
    // Emergency
    nama_kontak_darurat_1: string | null;
    no_kontak_darurat_1: string | null;
    nama_kontak_darurat_2: string | null;
    no_kontak_darurat_2: string | null;
    // Salary
    gaji_pokok: number;
    tunjangan_jabatan: number;
    tunjangan_kehadiran: number;
    tunjangan_transportasi: number;
    uang_makan: number;
    uang_lembur: number;
    thr: number;
    gaji_bpjs_tk: number;
    gaji_bpjs_jkn: number;
    gross_up: boolean;
    // Deductions
    pinjaman_koperasi: number;
    potongan_lain_1: number;
    potongan_lain_2: number;
    // Relations
    department?: Department;
    position?: Position;
    work_location?: WorkLocation;
    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface DashboardStats {
    total_karyawan?: number;
    total_departemen?: number;
    pengajuan_cuti_pending?: number;
    karyawan_baru_bulan_ini?: number;
    total_anggota_tim?: number;
}
