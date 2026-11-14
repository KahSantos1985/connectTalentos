import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = async () => {
    setResendLoading(true);
    // Here you would implement the resend logic with Supabase
    // For now, just simulate a delay
    setTimeout(() => {
      setResendLoading(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Verifique seu Email
            </CardTitle>
            <CardDescription className="text-base">
              Enviamos um email de confirmação para sua caixa de entrada
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {email && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Email enviado para:
                </p>
                <p className="text-center font-medium mt-1">{email}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <p className="font-medium mb-1">Próximos passos:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200">
                    <li>Abra seu email</li>
                    <li>Procure por um email de "noreply@mail.app.supabase.io"</li>
                    <li>Clique no link de confirmação</li>
                    <li>Volte aqui e faça login</li>
                  </ol>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900 dark:text-amber-100">
                  <p className="font-medium mb-1">Não recebeu o email?</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200">
                    <li>Verifique sua caixa de spam</li>
                    <li>Aguarde alguns minutos</li>
                    <li>Clique no botão abaixo para reenviar</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={resendLoading || resendSuccess}
                variant="outline"
                className="w-full"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : resendSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Email Reenviado!
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar Email de Confirmação
                  </>
                )}
              </Button>

              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-primary text-white hover:opacity-90 transition-smooth"
              >
                Ir para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConfirmEmailPage;
