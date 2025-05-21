const memoryStore = new Map<string, string>();

export async function saveCorrectAnswer(id: string, correct: string) {
  memoryStore.set(id, correct);
}

export async function getCorrectAnswer(id: string): Promise<string | null> {
  return memoryStore.get(id) ?? null;
}

export async function deleteCorrectAnswer(id: string) {
  memoryStore.delete(id);
}

export async function clearAllAnswers() {
  memoryStore.clear();
}