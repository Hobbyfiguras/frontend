<template>
  <article class="tile is-child notification is-primary">
    <div class="level">
      <div class="level-left">
        <template v-if="!editing">
          <p class="subtitle">{{value.name}}</p>
        </template>
        <template v-else>
          <b-input v-model="tempCategory.name"></b-input>
        </template>
      </div>
      <div clas="level-right">
        <div class="level-item field has-addons" v-if="!editing">
          <p class="control">
            <button class="button" @click="edit">
              <b-icon icon="pencil"></b-icon>
            </button>
          </p>
          <p class="control">
            <button class="button is-danger" @click="deleteCategory">
              <b-icon icon="delete"></b-icon>
            </button>
          </p>
        </div>
        <div class="level-item field has-addons" v-else>
          <p class="control">
            <button class="button is-success" @click="save">
              <b-icon icon="check"></b-icon>
            </button>
          </p>
          <p class="control">
            <button class="button is-danger" @click="cancel">
              <b-icon icon="close"></b-icon>
            </button>
          </p>
        </div>
      </div>
    </div>
    <template v-if="!editing">{{value.description}}</template>
    <template v-else>
      <b-input v-model="tempCategory.description" type="textarea"></b-input>
    </template>
  </article>
</template>

<script>
import petitionsMixin from "@/components/mixins/petitions";
import Forum from "@/api/forum";
import PostItem from "@/components/forum/PostItem";
export default {
  name: "admin_forum_categories",
  mixins: [petitionsMixin],
  components: { PostItem },
  props: ["value"],
  data() {
    return {
      tempCategory: {},
      editing: false
    };
  },
  methods: {
    edit() {
      this.editing = true;
      this.tempCategory = JSON.parse(JSON.stringify(this.value));
    },
    cancel() {
      this.editing = false;
    },
    save() {
      this.makePetition(Forum.updateForumCategory(this.tempCategory)).then(
        category => {
          this.$emit("input", this.tempCategory);
          this.editing = false;
        }
      );
    },
    deleteCategory() {
      this.$buefy.dialog.confirm({
        title: "Eliminar categoria",
        message: "Estas seguro de querer eliminar esta categoria?",
        confirmText: "Si",
        cancelText: "No, volver atrás",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.makePetition(Forum.deleteForumCategory(this.value.slug)).then(
            category => {
              this.$emit("deleteCategory", this.value);
            }
          );
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
