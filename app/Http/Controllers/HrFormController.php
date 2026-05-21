<?php

namespace App\Http\Controllers;

use App\Models\WorkCertificate;
use App\Models\Paklaring;
use App\Models\AppointmentLetter;
use App\Models\OfferingLetter;
use App\Models\TransferLetter;
use App\Models\ReferenceLetter;
use App\Models\TerminationLetter;
use App\Models\PromotionLetter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HrFormController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $perms = [
            'skb' => $this->hasMod($user, 'skb'),
            'paklaring' => $this->hasMod($user, 'paklaring'),
            'appointment' => $this->hasMod($user, 'appointment'),
            'offering' => $this->hasMod($user, 'offering'),
            'transfer' => $this->hasMod($user, 'transfer'),
            'reference' => $this->hasMod($user, 'reference'),
            'termination' => $this->hasMod($user, 'termination'),
            'promotion' => $this->hasMod($user, 'promotion'),
        ];

        if (!array_filter($perms)) {
            return redirect()->route('dashboard')->withErrors(['error' => 'No permission.']);
        }

        $data = [];

        if ($perms['skb']) {
            $data['skb'] = WorkCertificate::with(['employee', 'maker'])
                ->when($request->search_skb, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhereHas('employee', fn($q) => $q->where('nama', 'like', "%{$s}%")))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'skb_page')->withQueryString();
        }

        if ($perms['paklaring']) {
            $data['paklarings'] = Paklaring::with(['employee', 'maker', 'company'])
                ->when($request->search_paklaring, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhereHas('employee', fn($q) => $q->where('nama', 'like', "%{$s}%")))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'paklaring_page')->withQueryString();
        }

        if ($perms['appointment']) {
            $data['appointments'] = AppointmentLetter::with(['employee', 'maker', 'company'])
                ->when($request->search_appointment, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhereHas('employee', fn($q) => $q->where('nama', 'like', "%{$s}%")))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'appointment_page')->withQueryString();
        }

        if ($perms['offering']) {
            $data['offerings'] = OfferingLetter::with(['maker', 'company'])
                ->when($request->search_offering, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhere('candidate_name', 'like', "%{$s}%"))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'offering_page')->withQueryString();
        }

        if ($perms['transfer']) {
            $data['transfers'] = TransferLetter::with(['employee', 'maker', 'company'])
                ->when($request->search_transfer, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhereHas('employee', fn($q) => $q->where('nama', 'like', "%{$s}%")))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'transfer_page')->withQueryString();
        }

        if ($perms['reference']) {
            $data['references'] = ReferenceLetter::with(['employee', 'maker', 'company'])
                ->when($request->search_reference, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhereHas('employee', fn($q) => $q->where('nama', 'like', "%{$s}%")))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'reference_page')->withQueryString();
        }

        if ($perms['termination']) {
            $data['terminations'] = TerminationLetter::with(['employee', 'maker', 'company'])
                ->when($request->search_termination, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhereHas('employee', fn($q) => $q->where('nama', 'like', "%{$s}%")))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'termination_page')->withQueryString();
        }

        if ($perms['promotion']) {
            $data['promotions'] = PromotionLetter::with(['employee', 'maker', 'company'])
                ->when($request->search_promotion, fn($q, $s) => $q->where('letter_number', 'like', "%{$s}%")->orWhereHas('employee', fn($q) => $q->where('nama', 'like', "%{$s}%")))
                ->orderBy('created_at', 'desc')->paginate(10, ['*'], 'promotion_page')->withQueryString();
        }

        return Inertia::render('hr-forms/index', array_merge($data, [
            'canViewSKB' => $perms['skb'],
            'canViewPaklaring' => $perms['paklaring'],
            'canViewAppointment' => $perms['appointment'],
            'canViewOffering' => $perms['offering'],
            'canViewTransfer' => $perms['transfer'],
            'canViewReference' => $perms['reference'],
            'canViewTermination' => $perms['termination'],
            'canViewPromotion' => $perms['promotion'],
            'filters' => $request->only(['tab', 'search_skb', 'search_paklaring', 'search_appointment', 'search_offering', 'search_transfer', 'search_reference', 'search_termination', 'search_promotion']),
        ]));
    }

    private function hasMod($user, string $prefix): bool
    {
        return $user->isAdmin() || $user->hasPermission("{$prefix}.view") || $user->hasPermission("{$prefix}.create") || $user->hasPermission("{$prefix}.edit") || $user->hasPermission("{$prefix}.delete");
    }
}
