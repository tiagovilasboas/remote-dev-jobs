import React, { useState, useEffect } from "react";

interface CacheStatusProps {
  source: string;
  onRefresh?: () => void;
}

interface CacheInfo {
  hasCache: boolean;
  timeUntilNextRequest: number;
  lastRequestTime: number | null;
}

export const CacheStatus: React.FC<CacheStatusProps> = ({
  source,
  onRefresh,
}) => {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCacheStatus = async () => {
    try {
      setLoading(true);
      // Aqui você faria a chamada para obter o status do cache
      // Por enquanto, vamos simular
      const mockInfo: CacheInfo = {
        hasCache: Math.random() > 0.5,
        timeUntilNextRequest: Math.floor(Math.random() * 20),
        lastRequestTime: Date.now() - Math.random() * 1200000,
      };
      setCacheInfo(mockInfo);
    } catch (error) {
      console.error("Erro ao buscar status do cache:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCacheStatus();
    const interval = setInterval(fetchCacheStatus, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, [source]);

  const formatTime = (minutes: number) => {
    if (minutes === 0) return "Agora";
    if (minutes === 1) return "1 minuto";
    return `${minutes} minutos`;
  };

  const formatLastRequest = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Agora mesmo";
    if (minutes < 60) return `${minutes} min atrás`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;

    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <span>Verificando cache...</span>
      </div>
    );
  }

  if (!cacheInfo) {
    return (
      <div className="text-sm text-gray-500">Status do cache indisponível</div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <div className="flex items-center space-x-3">
        <div
          className={`h-3 w-3 rounded-full ${cacheInfo.hasCache ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        <div>
          <div className="text-sm font-medium text-gray-900">{source}</div>
          <div className="text-xs text-gray-500">
            {cacheInfo.hasCache ? "Cache disponível" : "Sem cache"}
            {cacheInfo.lastRequestTime && (
              <span className="ml-2">
                • Última atualização:{" "}
                {formatLastRequest(cacheInfo.lastRequestTime)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {cacheInfo.timeUntilNextRequest > 0 && (
          <div className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-600">
            Próxima atualização em {formatTime(cacheInfo.timeUntilNextRequest)}
          </div>
        )}

        {onRefresh && cacheInfo.timeUntilNextRequest === 0 && (
          <button
            onClick={onRefresh}
            className="rounded bg-blue-500 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-600"
          >
            Atualizar
          </button>
        )}
      </div>
    </div>
  );
};
