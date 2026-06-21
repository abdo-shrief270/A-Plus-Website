/**
 * Globally-shared open-state for the four "fast action" creation modals.
 * The dashboard layout mounts the actual modal components and binds them
 * to these refs. Anywhere in the app — the navbar, a page's empty-state
 * button, a sidebar quick-link — can flip a flag to true and the modal
 * pops open without the page itself having to mount it.
 */
export const useCreationModals = () => {
  const addKid = useState('global-modal-add-kid', () => false)
  const enrollCourse = useState('global-modal-enroll-course', () => false)
  const subscribePlan = useState('global-modal-subscribe-plan', () => false)
  const newTicket = useState('global-modal-new-ticket', () => false)

  return { addKid, enrollCourse, subscribePlan, newTicket }
}
