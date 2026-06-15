"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  regenerateRecoveryCodesAction,
  storeMfaRecoveryCodesAction,
} from "@/app/actions/account-settings";
import {
  buttonPrimaryClassName,
  buttonSecondaryClassName,
  inputClassName,
  labelClassName,
} from "@/components/dashboard/form-fields";
import { InlineFormFeedback, SettingRow, StatusBadge } from "./settings-ui";

type MfaSettingsProps = {
  mfaEnabled: boolean;
  mfaFactorId: string | null;
  recoveryRemaining: number;
  recoveryTotal: number;
};

export function MfaSettings({
  mfaEnabled: initialEnabled,
  mfaFactorId: initialFactorId,
  recoveryRemaining,
  recoveryTotal,
}: MfaSettingsProps) {
  const supabase = createClient();
  const [mfaEnabled, setMfaEnabled] = useState(initialEnabled);
  const [factorId, setFactorId] = useState<string | null>(initialFactorId);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [remaining, setRemaining] = useState(recoveryRemaining);

  const startEnroll = async () => {
    setLoading(true);
    setError(undefined);
    setSuccess(undefined);

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator app",
    });

    setLoading(false);

    if (enrollError || !data) {
      setError(enrollError?.message ?? "Could not start 2FA setup.");
      return;
    }

    setEnrolling(true);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setPendingFactorId(data.id);
  };

  const verifyEnroll = async () => {
    if (!pendingFactorId || verifyCode.length < 6) return;

    setLoading(true);
    setError(undefined);

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: pendingFactorId,
    });

    if (challengeError || !challenge) {
      setLoading(false);
      setError(challengeError?.message ?? "Challenge failed.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: pendingFactorId,
      challengeId: challenge.id,
      code: verifyCode.trim(),
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    const codesResult = await storeMfaRecoveryCodesAction();
    if (codesResult.error) {
      setError(codesResult.error);
      return;
    }

    setMfaEnabled(true);
    setFactorId(pendingFactorId);
    setEnrolling(false);
    setQrCode(null);
    setSecret(null);
    setPendingFactorId(null);
    setVerifyCode("");
    setSuccess("Two-factor authentication enabled.");
    if (codesResult.recoveryCodes) {
      setRecoveryCodes(codesResult.recoveryCodes);
      setRemaining(codesResult.recoveryCodes.length);
    }
  };

  const disableMfa = async () => {
    const id = factorId ?? pendingFactorId;
    if (!id || disableCode.length < 6) return;

    setLoading(true);
    setError(undefined);

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: id });
    if (challengeError || !challenge) {
      setLoading(false);
      setError(challengeError?.message ?? "Challenge failed.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: id,
      challengeId: challenge.id,
      code: disableCode.trim(),
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: id });
    setLoading(false);

    if (unenrollError) {
      setError(unenrollError.message);
      return;
    }

    setMfaEnabled(false);
    setFactorId(null);
    setDisableCode("");
    setRecoveryCodes(null);
    setRemaining(0);
    setSuccess("Two-factor authentication disabled.");
  };

  const regenerateCodes = async () => {
    setLoading(true);
    setError(undefined);
    const result = await regenerateRecoveryCodesAction();
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setRecoveryCodes(result.recoveryCodes ?? null);
    setRemaining(result.recoveryCodes?.length ?? 0);
    setSuccess("New recovery codes generated.");
  };

  return (
    <div className="space-y-0">
      <SettingRow
        label="Two-Factor Authentication"
        description="Protect your account with an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)."
      >
        <div className="space-y-3">
          <StatusBadge enabled={mfaEnabled} label={mfaEnabled ? "2FA enabled" : "2FA disabled"} />
          {!mfaEnabled && !enrolling ? (
            <button type="button" onClick={startEnroll} disabled={loading} className={buttonPrimaryClassName}>
              {loading ? "Starting..." : "Enable 2FA"}
            </button>
          ) : null}
        </div>
      </SettingRow>

      {enrolling && qrCode ? (
        <SettingRow
          label="Scan QR code"
          description="Scan with your authenticator app, then enter the 6-digit code to verify."
        >
          <div className="space-y-3">
            <div
              className="mx-auto w-fit rounded-lg border border-white/10 bg-white p-3"
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
            {secret ? (
              <p className="break-all font-mono text-[10px] text-neutral-500">
                Manual key: {secret}
              </p>
            ) : null}
            <div>
              <label htmlFor="mfa-verify" className={labelClassName}>
                Verification code
              </label>
              <input
                id="mfa-verify"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="000000"
                className={inputClassName}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={verifyEnroll} disabled={loading || verifyCode.length < 6} className={buttonPrimaryClassName}>
                Verify & enable
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnrolling(false);
                  setQrCode(null);
                  setSecret(null);
                  setPendingFactorId(null);
                }}
                className={buttonSecondaryClassName}
              >
                Cancel
              </button>
            </div>
          </div>
        </SettingRow>
      ) : null}

      {mfaEnabled ? (
        <>
          <SettingRow
            label="Recovery codes"
            description={`${remaining} of ${recoveryTotal || remaining} codes remaining. Store these somewhere safe.`}
          >
            <div className="space-y-3">
              <button type="button" onClick={regenerateCodes} disabled={loading} className={buttonSecondaryClassName}>
                {loading ? "Generating..." : "Generate new codes"}
              </button>
              {recoveryCodes ? (
                <div className="rounded-lg border border-white/10 bg-[#0a0a0a] p-3 font-mono text-xs text-neutral-300">
                  {recoveryCodes.map((code) => (
                    <div key={code}>{code}</div>
                  ))}
                  <p className="mt-2 text-[10px] text-neutral-500">Copy these now — they won&apos;t be shown again.</p>
                </div>
              ) : null}
            </div>
          </SettingRow>

          <SettingRow
            label="Disable 2FA"
            description="Enter a current authenticator code to turn off two-factor authentication."
          >
            <div className="space-y-3">
              <input
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="000000"
                className={inputClassName}
              />
              <button
                type="button"
                onClick={disableMfa}
                disabled={loading || disableCode.length < 6}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/15"
              >
                Disable 2FA
              </button>
            </div>
          </SettingRow>
        </>
      ) : null}

      <div className="px-5 pb-4">
        <InlineFormFeedback error={error} success={success} />
      </div>
    </div>
  );
}
