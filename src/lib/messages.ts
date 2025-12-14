export const MESSAGES = {
    // Saudações
    greetings: {
        morning: 'Bom dia',
        afternoon: 'Boa tarde',
        evening: 'Boa noite',
    },

    // Tarefas
    tasks: {
        completed: 'Boa! ✓',
        skipped: 'Tudo bem pular às vezes',
        postponed: 'Sem problemas, fica pra depois',
        allDone: 'Você completou tudo! 🎉',
    },

    // Progresso
    progress: {
        great: 'Você tá arrasando hoje!',
        good: 'Bom progresso!',
        keep_going: 'Continua assim!',
        its_ok: 'Cada passo conta 💙',
    },

    // Dia difícil
    difficultDay: {
        title: 'Tudo bem ir devagar hoje',
        description: 'O importante é cuidar de você. Foca só no essencial.',
        activated: 'Modo dia difícil ativado 💙',
    },

    // Parceiro
    partner: {
        great_job: 'Mandou bem hoje! 👍',
        you_can_do_it: 'Você consegue! 💪',
        need_help: 'Precisa de ajuda? 🤝',
        making_coffee: 'Vou fazer um café/chá ☕',
        im_here: 'Tô aqui com você 🫂',
    },

    // Streak
    streak: {
        new_record: 'Novo recorde! 🏆',
        keep_going: 'Não quebre a sequência!',
        lost: 'Tudo bem, vamos começar de novo 💪',
    },

    // Erros
    errors: {
        generic: 'Algo deu errado. Tente novamente.',
        network: 'Sem conexão. Verifique sua internet.',
        save: 'Erro ao salvar. Tente novamente.',
        load: 'Erro ao carregar. Tente novamente.',
    },

    // Sucesso
    success: {
        saved: 'Salvo com sucesso!',
        deleted: 'Removido com sucesso!',
        sent: 'Enviado!',
    },

    // Vazios
    empty: {
        tasks: 'Nenhuma tarefa para hoje',
        routines: 'Você ainda não tem rotinas',
        suggestions: 'Nenhuma sugestão pendente',
    },
};

export function getProgressMessage(percentage: number): string {
    if (percentage >= 80) return MESSAGES.progress.great;
    if (percentage >= 50) return MESSAGES.progress.good;
    if (percentage >= 25) return MESSAGES.progress.keep_going;
    return MESSAGES.progress.its_ok;
}
