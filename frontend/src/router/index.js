import { createRouter, createWebHistory } from 'vue-router'
import LoggedInView from '../views/LoggedInHome.vue'
import RecipeExpanded from '../views/RecipeExpanded.vue'
import SavedRecipesView from '@/views/SavedRecipesView.vue'
import MealPlannerView from '@/views/MealPlannerView.vue'
import RoadMapView from '@/views/RoadMapView.vue'
import StackView from '@/views/StackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoggedInView
    },
    {
      path: '/recipes/:id/:user/:saved',
      name: 'recipe',
      component: RecipeExpanded,
      props: true
    },
    {
      path: '/saved-recipes',
      name: 'savedRecipes',
      component: SavedRecipesView,
      props: true
    },
    {
      path: '/meal-planner',
      name: 'MealPlanner',
      component: MealPlannerView,
      props: true
    },
    {
      path: '/road-map',
      name: 'RoadMap',
      component: RoadMapView
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/'
    },
    {
      path: '/stack',
      name: 'tech-stack',
      component: StackView
    }
  ]
})

export default router
