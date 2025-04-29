import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormFeedback } from "../ui/form-feedback";
import { createEvaluation } from "../../lib/firebase";

interface FormFeedbackProps {
  variant: "error" | "success";
  message: string;
}

export function EvaluationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createEvaluation({
        name,
        email,
        rating,
        comment,
        status: "em_analise",
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);
      setName("");
      setEmail("");
      setRating(0);
      setComment("");
    } catch (err) {
      setError("Erro ao enviar avaliação. Tente novamente.");
      console.error("Erro ao criar avaliação:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Avaliação</Label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                value <= rating
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comentário</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
        />
      </div>

      {error && <FormFeedback variant="error" message={error} />}
      {success && (
        <FormFeedback
          variant="success"
          message="Avaliação enviada com sucesso! Obrigado pelo seu feedback."
        />
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  );
} 