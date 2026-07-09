/**
 * Stato di un passo del wizard "Comunica i tuoi redditi a Inarcassa".
 * `status` è omesso per il passo corrente (calcolato dallo stepper via activeStep).
 */
export interface RedditiStep {
  title: string
  status?: 'completed' | 'error' | 'disabled'
}
