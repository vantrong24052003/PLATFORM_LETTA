export const useLoadingLogic = () => {
  const isLoading = ref(true)
  const progress = ref(0)
  const loadingSteps = ref<string[]>([])

  const removeLoadingStep = (step: string) => {
    const index = loadingSteps.value.indexOf(step)
    if (index > -1) {
      loadingSteps.value.splice(index, 1)
      updateProgress()
    }
  }

  const updateProgress = () => {
    const totalSteps = 4
    const completedSteps = totalSteps - loadingSteps.value.length
    progress.value = Math.round((completedSteps / totalSteps) * 100)
  }

  const startLoading = () => {
    isLoading.value = true
    progress.value = 0
    loadingSteps.value = [
      'theme-init',
      'locale-init',
      'components-load',
      'assets-load'
    ]
  }

  const finishLoading = () => {
    loadingSteps.value = []
    progress.value = 100

    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }

  const initLoading = async () => {
    startLoading()

    await nextTick()

    await new Promise(resolve => setTimeout(resolve, 100))
    removeLoadingStep('theme-init')

    await new Promise(resolve => setTimeout(resolve, 80))
    removeLoadingStep('locale-init')

    await new Promise(resolve => setTimeout(resolve, 120))
    removeLoadingStep('components-load')

    await new Promise(resolve => setTimeout(resolve, 100))
    removeLoadingStep('assets-load')

    progress.value = 100
    await new Promise(resolve => setTimeout(resolve, 200))

    finishLoading()
  }

  return { isLoading: readonly(isLoading), progress: readonly(progress), initLoading }
}
