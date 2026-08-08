import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher l'UI de repli au prochain rendu.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // On pourrait logger l'erreur ici (Sentry, etc.)
    console.error("ErrorBoundary a intercepté une erreur :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-theme-bg flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500 w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-theme-text mb-4">Oups ! Quelque chose s'est cassé.</h1>
          <p className="text-theme-text-muted mb-8 max-w-md mx-auto">
            L'application a rencontré une erreur inattendue. Vous pouvez essayer de recharger la page ou de réinitialiser vos données locales.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
            <button
              onClick={() => window.location.reload()}
              className="bg-theme-primary text-black font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Recharger la page
            </button>
            <button
              onClick={() => {
                if (window.confirm('Attention, cela va effacer toutes vos données sauvegardées localement (favoris, plans, etc.). Continuer ?')) {
                  localStorage.clear();
                  window.location.href = '/';
                }
              }}
              className="bg-red-500/10 text-red-500 font-bold px-6 py-3 rounded-xl border border-red-500/30 hover:bg-red-500/20"
            >
              Vider le cache
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-[#111] border border-red-500/30 rounded-xl text-left max-w-2xl w-full overflow-x-auto text-xs text-red-400 font-mono">
              <p className="font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
