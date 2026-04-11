"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Smartphone,
  Bell,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Check,
  X,
  Activity,
  Heart,
  Camera,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";
import { DataExporter } from "@/lib/health/data-export";

/* -------------------------------------------------------------------------- */
/*  Toggle switch component                                                    */
/* -------------------------------------------------------------------------- */

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="relative inline-flex h-6 w-12 flex-shrink-0 rounded-full transition-colors duration-200"
      style={{ backgroundColor: enabled ? "#34A853" : "#DADCE0" }}
    >
      <span
        className="inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200"
        style={{
          transform: enabled ? "translate(26px, 2px)" : "translate(2px, 2px)",
        }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Notification keys                                                          */
/* -------------------------------------------------------------------------- */

const notifItems = [
  { key: "notif-checkin", label: "Lembrete de check-in diario" },
  { key: "notif-metas", label: "Metas semanais" },
  { key: "notif-pesagem", label: "Pesagem semanal" },
  { key: "notif-dicas", label: "Dicas de saude" },
];

/* -------------------------------------------------------------------------- */
/*  Insurance config type                                                      */
/* -------------------------------------------------------------------------- */

interface InsuranceConfig {
  operadora: string;
  apolice: string;
  renovacao: string;
  valor: string;
}

const defaultInsurance: InsuranceConfig = {
  operadora: "",
  apolice: "",
  renovacao: "",
  valor: "",
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ConfigPage() {
  const router = useRouter();

  // --- Health connection ---
  const [healthConnected, setHealthConnected] = useState(false);
  const [checking, setChecking] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  // --- Sensors ---
  const [sensors, setSensors] = useState({
    accelerometer: true,
    camera: false,
    gps: false,
  });

  // --- Notifications ---
  const [notifs, setNotifs] = useState<Record<string, boolean>>({});

  // --- Insurance ---
  const [insurance, setInsurance] = useState<InsuranceConfig>(defaultInsurance);
  const [insuranceSaved, setInsuranceSaved] = useState(false);

  // --- Data / LGPD ---
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- Modals ---
  const [showTermos, setShowTermos] = useState(false);
  const [showPrivacidade, setShowPrivacidade] = useState(false);

  /* ---- Load persisted state ---- */
  useEffect(() => {
    // Notifications
    const loaded: Record<string, boolean> = {};
    notifItems.forEach((n) => {
      const val = localStorage.getItem(n.key);
      loaded[n.key] = val === null ? true : val === "true";
    });
    setNotifs(loaded);

    // Insurance
    const ins = localStorage.getItem("insurance-config");
    if (ins) {
      try {
        setInsurance(JSON.parse(ins));
      } catch {
        /* ignore */
      }
    }

    // Sensors
    const detectSensors = async () => {
      let cam = false;
      let gps = false;
      try {
        cam = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      } catch {
        /* */
      }
      try {
        gps = !!navigator.geolocation;
      } catch {
        /* */
      }
      setSensors({ accelerometer: true, camera: cam, gps });
    };
    detectSensors();

    // Health status from localStorage
    const hc = localStorage.getItem("health-connected");
    if (hc === "true") setHealthConnected(true);
  }, []);

  /* ---- Health Connect ---- */
  const handleConnectHealth = async () => {
    setChecking(true);
    try {
      // Timeout de 5 segundos para evitar travamento
      const result = await Promise.race([
        (async () => {
          const { getHealthService } = await import("@/lib/health");
          const service = await getHealthService();
          const granted = await service.requestPermissions();
          return granted;
        })(),
        new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 5000)
        ),
      ]);
      setHealthConnected(result);
      localStorage.setItem("health-connected", String(result));
    } catch (err) {
      console.log("Health Connect não disponível:", err);
      setHealthConnected(false);
      localStorage.setItem("health-connected", "false");
      setHealthError("Health Connect não disponível neste dispositivo. Instale o app Health Connect da Play Store.");
    }
    setChecking(false);
  };

  /* ---- Notification toggle ---- */
  const toggleNotif = (key: string, value: boolean) => {
    setNotifs((prev) => ({ ...prev, [key]: value }));
    localStorage.setItem(key, String(value));
  };

  /* ---- Insurance save ---- */
  const handleSaveInsurance = () => {
    localStorage.setItem("insurance-config", JSON.stringify(insurance));
    setInsuranceSaved(true);
    setTimeout(() => setInsuranceSaved(false), 2000);
  };

  /* ---- Export ---- */
  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await DataExporter.exportAllData();
      await DataExporter.downloadAsJson(data);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  /* ---- Delete all ---- */
  const handleDeleteAll = async () => {
    await DataExporter.deleteAllData();
    setShowDeleteConfirm(false);
    window.location.reload();
  };

  /* ---- Logout ---- */
  const handleLogout = () => {
    localStorage.removeItem("saluflow-onboarded");
    router.push("/onboarding");
  };

  /* ---- Sensor row helper ---- */
  const SensorRow = ({
    label,
    available,
    icon: Icon,
  }: {
    label: string;
    available: boolean;
    icon: React.ElementType;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#5F6368]" />
        <span className="text-sm text-[#202124]">{label}</span>
      </div>
      {available ? (
        <Check className="w-4 h-4 text-[#34A853]" />
      ) : (
        <X className="w-4 h-4 text-[#EA4335]" />
      )}
    </div>
  );

  return (
    <AppShell>
      <div className="flex flex-col min-h-screen pb-24 bg-white">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 pt-6 pb-4 px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/perfil" className="p-1">
            <ChevronLeft className="w-6 h-6 text-[#202124]" />
          </Link>
          <h1 className="text-xl font-bold text-[#202124]">Configuracoes</h1>
        </motion.div>

        <div className="flex flex-col gap-6 px-4">
          {/* ============================================================== */}
          {/*  SECTION 1: Conexoes de Saude                                   */}
          {/* ============================================================== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2 px-1">
              Conexoes de Saude
            </p>

            {/* Health Connect */}
            <div
              className="rounded-2xl p-4 border mb-3"
              style={{ borderColor: "#DADCE0", backgroundColor: "#FFFFFF" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#1A73E8]" />
                  <span className="text-sm font-semibold text-[#202124]">
                    Google Fit / Health Connect
                  </span>
                </div>
                {healthConnected && (
                  <span className="text-xs text-[#34A853] font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Conectado
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5F6368] mb-3">
                Permite ler passos, sono e exercicios automaticamente
              </p>
              <button
                onClick={handleConnectHealth}
                disabled={checking || healthConnected}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: healthConnected ? "#34A853" : healthError ? "#9AA0A6" : "#1A73E8" }}
              >
                {checking
                  ? "Verificando..."
                  : healthConnected
                    ? "Conectado ✓"
                    : healthError
                      ? "Tentar novamente"
                      : "Conectar"}
              </button>
              {healthError && (
                <p className="text-xs text-[#EA4335] mt-2 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {healthError}
                </p>
              )}
            </div>

            {/* Sensors */}
            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: "#DADCE0", backgroundColor: "#FFFFFF" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-5 h-5 text-[#5F6368]" />
                <span className="text-sm font-semibold text-[#202124]">
                  Sensores do dispositivo
                </span>
              </div>
              <SensorRow
                label="Acelerometro (sono automatico)"
                available={sensors.accelerometer}
                icon={Activity}
              />
              <SensorRow
                label="Camera (fotos verificadas)"
                available={sensors.camera}
                icon={Camera}
              />
              <SensorRow
                label="GPS (localizacao)"
                available={sensors.gps}
                icon={MapPin}
              />
            </div>
          </motion.section>

          {/* ============================================================== */}
          {/*  SECTION 2: Notificacoes                                        */}
          {/* ============================================================== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2 px-1">
              Notificacoes
            </p>
            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: "#DADCE0", backgroundColor: "#FFFFFF" }}
            >
              {notifItems.map((item, i) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between py-3 ${
                    i < notifItems.length - 1 ? "border-b border-[#F1F3F4]" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#5F6368]" />
                    <span className="text-sm text-[#202124]">{item.label}</span>
                  </div>
                  <Toggle
                    enabled={notifs[item.key] ?? true}
                    onChange={(v) => toggleNotif(item.key, v)}
                  />
                </div>
              ))}
            </div>
          </motion.section>

          {/* ============================================================== */}
          {/*  SECTION 3: Meu plano de saude                                  */}
          {/* ============================================================== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2 px-1">
              Meu plano de saude
            </p>
            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: "#DADCE0", backgroundColor: "#FFFFFF" }}
            >
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-[#5F6368] mb-1 block">
                    Operadora
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Amil, Bradesco Saude"
                    value={insurance.operadora}
                    onChange={(e) =>
                      setInsurance((p) => ({ ...p, operadora: e.target.value }))
                    }
                    className="w-full py-2.5 px-3 rounded-xl border border-[#DADCE0] text-sm text-[#202124] bg-[#F8F9FA] focus:outline-none focus:border-[#1A73E8] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#5F6368] mb-1 block">
                    Numero da apolice
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1234567890"
                    value={insurance.apolice}
                    onChange={(e) =>
                      setInsurance((p) => ({ ...p, apolice: e.target.value }))
                    }
                    className="w-full py-2.5 px-3 rounded-xl border border-[#DADCE0] text-sm text-[#202124] bg-[#F8F9FA] focus:outline-none focus:border-[#1A73E8] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#5F6368] mb-1 block">
                    Data de renovacao
                  </label>
                  <input
                    type="date"
                    value={insurance.renovacao}
                    onChange={(e) =>
                      setInsurance((p) => ({ ...p, renovacao: e.target.value }))
                    }
                    className="w-full py-2.5 px-3 rounded-xl border border-[#DADCE0] text-sm text-[#202124] bg-[#F8F9FA] focus:outline-none focus:border-[#1A73E8] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#5F6368] mb-1 block">
                    Valor mensal (R$)
                  </label>
                  <input
                    type="number"
                    placeholder="0,00"
                    value={insurance.valor}
                    onChange={(e) =>
                      setInsurance((p) => ({ ...p, valor: e.target.value }))
                    }
                    className="w-full py-2.5 px-3 rounded-xl border border-[#DADCE0] text-sm text-[#202124] bg-[#F8F9FA] focus:outline-none focus:border-[#1A73E8] transition-colors"
                  />
                </div>
                <button
                  onClick={handleSaveInsurance}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                  style={{
                    backgroundColor: insuranceSaved ? "#34A853" : "#1A73E8",
                  }}
                >
                  {insuranceSaved ? "Salvo!" : "Salvar"}
                </button>
              </div>
            </div>
          </motion.section>

          {/* ============================================================== */}
          {/*  SECTION 4: Privacidade e dados (LGPD)                          */}
          {/* ============================================================== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2 px-1">
              Privacidade e dados (LGPD)
            </p>
            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: "#DADCE0", backgroundColor: "#FFFFFF" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-[#34A853]" />
                <span className="text-sm font-semibold text-[#202124]">
                  Seus dados ficam apenas no seu dispositivo
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: "#1A73E8" }}
                >
                  {exporting ? "Exportando..." : "Exportar meus dados"}
                </button>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Apagar todos os dados
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 p-3 rounded-xl bg-red-50">
                    <p className="text-xs text-red-600 text-center font-medium">
                      Tem certeza? Todos os seus dados serao apagados
                      permanentemente.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2 rounded-lg text-xs font-medium text-[#5F6368] border border-[#DADCE0]"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDeleteAll}
                        className="flex-1 py-2 rounded-lg text-xs font-medium text-white bg-red-500"
                      >
                        Apagar tudo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* ============================================================== */}
          {/*  SECTION 5: Sobre                                               */}
          {/* ============================================================== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <p className="text-[10px] font-bold tracking-wider text-[#9AA0A6] uppercase mb-2 px-1">
              Sobre
            </p>
            <div
              className="rounded-2xl p-4 border"
              style={{ borderColor: "#DADCE0", backgroundColor: "#FFFFFF" }}
            >
              <p className="text-sm text-[#202124] font-semibold mb-3">
                SaluFlow v1.0.0
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowTermos(true)}
                  className="flex items-center justify-between w-full py-2"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#5F6368]" />
                    <span className="text-sm text-[#202124]">Termos de uso</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#DADCE0]" />
                </button>
                <button
                  onClick={() => setShowPrivacidade(true)}
                  className="flex items-center justify-between w-full py-2"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#5F6368]" />
                    <span className="text-sm text-[#202124]">
                      Politica de privacidade
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#DADCE0]" />
                </button>
              </div>
            </div>
          </motion.section>

          {/* ============================================================== */}
          {/*  SECTION 6: Sair                                                */}
          {/* ============================================================== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#EA4335" }}
            >
              <span className="flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Sair do SaluFlow
              </span>
            </button>
          </motion.section>
        </div>
      </div>

      {/* ================================================================== */}
      {/*  Modal: Termos de uso                                               */}
      {/* ================================================================== */}
      {showTermos && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setShowTermos(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#202124]">Termos de uso</h2>
              <button onClick={() => setShowTermos(false)}>
                <X className="w-5 h-5 text-[#5F6368]" />
              </button>
            </div>
            <div className="text-sm text-[#5F6368] space-y-3">
              <p>
                Bem-vindo ao SaluFlow. Ao utilizar este aplicativo, voce concorda
                com os seguintes termos:
              </p>
              <p>
                <strong>1. Uso do aplicativo:</strong> O SaluFlow e uma ferramenta
                de acompanhamento de saude pessoal. As informacoes fornecidas nao
                substituem orientacao medica profissional.
              </p>
              <p>
                <strong>2. Dados pessoais:</strong> Todos os seus dados sao
                armazenados localmente no seu dispositivo. Nenhum dado e enviado
                para servidores externos.
              </p>
              <p>
                <strong>3. Responsabilidade:</strong> O usuario e responsavel pela
                veracidade das informacoes inseridas. O aplicativo nao se
                responsabiliza por decisoes tomadas com base nos dados exibidos.
              </p>
              <p>
                <strong>4. Alteracoes:</strong> Estes termos podem ser atualizados
                a qualquer momento. O uso continuado do aplicativo implica
                aceitacao das alteracoes.
              </p>
              <p>
                <strong>5. Contato:</strong> Para duvidas ou solicitacoes, entre em
                contato pelo e-mail suporte@saluflow.app.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================================================================== */}
      {/*  Modal: Politica de privacidade                                     */}
      {/* ================================================================== */}
      {showPrivacidade && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setShowPrivacidade(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#202124]">
                Politica de privacidade
              </h2>
              <button onClick={() => setShowPrivacidade(false)}>
                <X className="w-5 h-5 text-[#5F6368]" />
              </button>
            </div>
            <div className="text-sm text-[#5F6368] space-y-3">
              <p>
                O SaluFlow respeita sua privacidade e esta em conformidade com a
                Lei Geral de Protecao de Dados (LGPD - Lei 13.709/2018).
              </p>
              <p>
                <strong>Armazenamento local:</strong> Todos os dados de saude,
                preferencias e configuracoes sao armazenados exclusivamente no seu
                dispositivo. Nenhuma informacao pessoal e transmitida a servidores
                externos.
              </p>
              <p>
                <strong>Portabilidade:</strong> Voce pode exportar todos os seus
                dados a qualquer momento em formato JSON, exercendo seu direito de
                portabilidade.
              </p>
              <p>
                <strong>Direito ao esquecimento:</strong> Voce pode apagar todos os
                seus dados permanentemente a qualquer momento atraves da opcao
                &quot;Apagar todos os dados&quot; nas configuracoes.
              </p>
              <p>
                <strong>Sensores:</strong> O aplicativo pode acessar sensores do
                dispositivo (acelerometro, GPS, camera) apenas com sua permissao
                explicita, para funcionalidades como monitoramento de sono e
                verificacao de atividades.
              </p>
              <p>
                <strong>Health Connect / Google Fit:</strong> A integracao com
                servicos de saude e opcional e requer autorizacao explicita. Os
                dados lidos sao armazenados apenas localmente.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AppShell>
  );
}
