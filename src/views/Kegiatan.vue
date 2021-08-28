<template>
  <div>
    <v-app-bar app absolute dense color="primary" dark elevate-on-scroll>
      <v-toolbar-title>
        <router-link to="/">
          <span class="white--text">Pengelolaan File</span>
        </router-link>
        <v-icon class="black--text">mdi-chevron-right</v-icon>
        <router-link to="/kegiatan">
          <span class="white--text">Kegiatan</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialogUbahPassword" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-edit</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h6">Ubah Password</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row align="center">
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password Baru"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text v-on:click="dialogUbahPassword = false">
              Batal
            </v-btn>
            <v-btn color="primary" text v-on:click="ubahPassword"> Ubah </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn icon v-on:click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-data-table
          :headers="koloms"
          :items="kegiatans"
          :items-per-page="10"
          :search="cari"
        >
          <template v-slot:top>
            <v-row align="center">
              <v-col cols="12">
                <v-text-field
                  v-model="cari"
                  append-icon="mdi-magnify"
                  label="Cari"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-dialog
                  v-model="dialogTambahKegiatan"
                  persistent
                  max-width="600px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" v-bind="attrs" v-on="on">
                      Tambah
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h6">Tambah Kegiatan</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row align="center">
                          <v-col cols="12">
                            <v-text-field
                              v-model="dataTambahKegiatan.kegiatan"
                              label="Nama Kegiatan"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="dataTambahKegiatan.tahun"
                              label="Tahun"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-autocomplete
                              v-model="dataTambahKegiatan.fungsi_id"
                              :items="fungsis"
                              item-text="fungsi"
                              item-value="id"
                              label="Pilih Fungsi"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        text
                        v-on:click="dialogTambahKegiatan = false"
                      >
                        Batal
                      </v-btn>
                      <v-btn color="primary" text v-on:click="tambahKegiatan">
                        Simpan
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog
                  v-model="dialogUbahKegiatan"
                  persistent
                  max-width="600px"
                >
                  <v-card>
                    <v-card-title>
                      <span class="text-h6">Ubah Kegiatan</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row align="center">
                          <v-col cols="12">
                            <v-text-field
                              v-model="dataUbahKegiatan.kegiatan"
                              label="Nama Kegiatan"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="dataUbahKegiatan.tahun"
                              label="Tahun"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-autocomplete
                              v-model="dataUbahKegiatan.fungsi_id"
                              :items="fungsis"
                              item-text="fungsi"
                              item-value="id"
                              label="Pilih Fungsi"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        text
                        v-on:click="dialogUbahKegiatan = false"
                      >
                        Batal
                      </v-btn>
                      <v-btn color="primary" text v-on:click="ubahKegiatan">
                        Ubah
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-dialog
                  v-model="dialogHapusKegiatan"
                  persistent
                  max-width="600px"
                >
                  <v-card>
                    <v-card-title>
                      <span class="text-h6">Hapus Kegiatan</span>
                    </v-card-title>
                    <v-card-text>
                      <span class="text-subtitle-2">
                        Apakah Anda ingin menghapus Kegiatan ini?
                      </span>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        text
                        v-on:click="dialogHapusKegiatan = false"
                      >
                        Batal
                      </v-btn>
                      <v-btn color="primary" text v-on:click="hapusKegiatan">
                        Hapus
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.aksi="{ item }">
            <v-btn icon>
              <v-icon small v-on:click="showDialogUbahKegiatan(item)">
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon small v-on:click="showDialogHapusKegiatan(item)">
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
      <v-snackbar v-model="snackbar">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            v-on:click="snackbar = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "Kegiatan",
  data: function () {
    return {
      token: "",
      user: {},
      password: "",
      cari: "",
      fungsis: [],
      kegiatans: [],
      koloms: [],
      showPassword: false,
      dialogUbahPassword: false,
      dialogTambahKegiatan: false,
      dialogUbahKegiatan: false,
      dialogHapusKegiatan: false,
      dataTambahKegiatan: {
        kegiatan: "",
        tahun: "",
        fungsi_id: "",
      },
      dataUbahKegiatan: {},
      dataHapusKegiatan: {},
      snackbar: false,
      snackbarText: "",
      overlay: false,
    };
  },
  created: async function () {
    this.token = localStorage.token;
    const userRequest = await this.getData("/auth/me", this.token);
    if (userRequest.status != 200) {
      this.$router.push("/login");
    } else {
      this.user = await userRequest.json();
      if (this.user.level != 1) {
        this.$router.push("/");
      } else {
        const fungsiRequest = await this.getData("/fungsi/get", this.token);
        this.fungsis = await fungsiRequest.json();
        const kegiatanRequest = await this.getData(
          "/kegiatan/get/join",
          this.token
        );
        this.kegiatans = await kegiatanRequest.json();
        this.koloms = [
          { text: "Kegiatan", value: "kegiatan" },
          { text: "Tahun", value: "tahun" },
          { text: "Fungsi", value: "fungsi" },
          { text: "Aksi", value: "aksi", sortable: false },
        ];
      }
    }
  },
  methods: {
    getData: async function (path, token) {
      const result = await fetch(this.$url + path, {
        headers: {
          Authorization: "bearer" + token,
        },
      }).then(function (r) {
        return r;
      });
      return result;
    },
    postData: async function (path, body, token) {
      const result = await fetch(this.$url + path, {
        method: "POST",
        body: body,
        headers: {
          Authorization: "bearer" + token,
        },
      }).then(function (r) {
        return r;
      });
      return result;
    },
    tambahKegiatan: async function () {
      var tambahData = new FormData();
      tambahData.append("kegiatan", this.dataTambahKegiatan.kegiatan);
      tambahData.append("tahun", this.dataTambahKegiatan.tahun);
      tambahData.append("fungsi_id", this.dataTambahKegiatan.fungsi_id);
      const tambahKegiatanRequest = await this.postData(
        "/kegiatan/insert",
        tambahData,
        this.token
      );
      this.dialogTambahKegiatan = false;
      this.overlay = true;
      this.dataTambahKegiatan = {
        kegiatan: "",
        tahun: "",
        fungsi_id: "",
      };
      if (tambahKegiatanRequest.status != 200) {
        this.overlay = false;
        this.snackbarText = "Data tidak berhasil ditambahkan";
        this.snackbar = true;
      } else {
        this.overlay = false;
        const tambahKegiatanResponse = await tambahKegiatanRequest.json();
        this.snackbarText = tambahKegiatanResponse.pesan;
        this.snackbar = true;
        this.kegiatans = [];
        const kegiatanRequest = await this.getData(
          "/kegiatan/get/join",
          this.token
        );
        this.kegiatans = await kegiatanRequest.json();
      }
    },
    showDialogUbahKegiatan: function (v) {
      this.dataUbahKegiatan = v;
      this.dialogUbahKegiatan = true;
    },
    ubahKegiatan: async function () {
      var ubahData = new FormData();
      ubahData.append("id", this.dataUbahKegiatan.id);
      ubahData.append("kegiatan", this.dataUbahKegiatan.kegiatan);
      ubahData.append("tahun", this.dataUbahKegiatan.tahun);
      ubahData.append("fungsi_id", this.dataUbahKegiatan.fungsi_id);
      const ubahKegiatanRequest = await this.postData(
        "/kegiatan/edit",
        ubahData,
        this.token
      );
      this.dialogUbahKegiatan = false;
      this.overlay = true;
      this.dataUbahKegiatan = {};
      if (ubahKegiatanRequest.status != 200) {
        this.overlay = false;
        this.snackbarText = "Data tidak berhasil diubah";
        this.snackbar = true;
      } else {
        this.overlay = false;
        const ubahKegiatanResponse = await ubahKegiatanRequest.json();
        this.snackbarText = ubahKegiatanResponse.pesan;
        this.snackbar = true;
        this.kegiatans = [];
        const kegiatanRequest = await this.getData(
          "/kegiatan/get/join",
          this.token
        );
        this.kegiatans = await kegiatanRequest.json();
      }
    },
    showDialogHapusKegiatan: function (v) {
      this.dataHapusKegiatan = v;
      this.dialogHapusKegiatan = true;
    },
    hapusKegiatan: async function () {
      var hapusData = new FormData();
      hapusData.append("id", this.dataHapusKegiatan.id);
      const hapusKegiatanRequest = await this.postData(
        "/kegiatan/delete",
        hapusData,
        this.token
      );
      this.dialogHapusKegiatan = false;
      this.overlay = true;
      this.dataHapusKegiatan = {};
      if (hapusKegiatanRequest.status != 200) {
        this.overlay = false;
        this.snackbarText = "Data tidak berhasil dihapus";
        this.snackbar = true;
      } else {
        this.overlay = false;
        const hapusKegiatanResponse = await hapusKegiatanRequest.json();
        this.snackbarText = hapusKegiatanResponse.pesan;
        this.snackbar = true;
        this.kegiatans = [];
        const kegiatanRequest = await this.getData(
          "/kegiatan/get/join",
          this.token
        );
        this.kegiatans = await kegiatanRequest.json();
      }
    },
    ubahPassword: async function () {
      var passwordData = new FormData();
      passwordData.append("id", this.user.id);
      passwordData.append("password", this.password);
      const passwordRequest = await this.postData(
        "/user/password",
        passwordData,
        this.token
      );
      this.dialogUbahPassword = false;
      this.overlay = true;
      this.password = "";
      if (passwordRequest.status != 200) {
        this.overlay = false;
        this.snackbarText = "Password tidak berhasil diubah";
        this.snackbar = true;
      } else {
        this.overlay = false;
        const passwordResponse = await passwordRequest.json();
        this.snackbarText = passwordResponse.pesan;
        this.snackbar = true;
        this.files = [];
      }
    },
    logout: async function () {
      const logoutRequest = await this.getData("/auth/logout", this.token);
      if (logoutRequest.status == 200) {
        localStorage.removeItem("token");
        this.$router.push("/login");
      }
    },
  },
};
</script>
