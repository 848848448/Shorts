function goTo(pageId) {
    // באהאלט אלע בלעטער און דעם מעניו
    document.getElementById('main-menu').classList.add('hidden');
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

    // ווייז נאר דעם בלאט וואס מיר ווילן
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.remove('hidden');
    }
}
