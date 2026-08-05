import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Vérifie les mises à jour en tâche de fond toutes les heures
        setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[100] bg-[#1a1a1a] border border-[#333] shadow-2xl rounded-xl p-4 flex flex-col gap-3 max-w-sm animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-4 text-gray-200 text-sm font-medium">
        <span>
          {offlineReady
            ? 'L\'application est prête à fonctionner hors-ligne.'
            : 'Une nouvelle mise à jour est disponible !'}
        </span>
        <button onClick={close} className="text-gray-500 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
      
      {needRefresh && (
        <button
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          onClick={() => updateServiceWorker(true)}
        >
          <RefreshCw size={14} /> Mettre à jour et recharger
        </button>
      )}
    </div>
  )
}

export default ReloadPrompt;
