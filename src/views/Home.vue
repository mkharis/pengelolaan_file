<template>
  <div>
    <v-app-bar app absolute dense color="primary" dark elevate-on-scroll>
      <v-toolbar-title>
        <router-link to="/">
          <span class="white--text">Pengelolaan File</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/kegiatan">
        <v-btn icon v-if="user.level == 1">
          <v-icon>mdi-file-document-edit</v-icon>
        </v-btn>
      </router-link>
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
        <v-expansion-panels v-if="showPanel" v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="text-h6">Filter</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedFungsiId"
                      :items="fungsis"
                      item-text="fungsi"
                      item-value="id"
                      label="Pilih Fungsi"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedTahun"
                      :items="tahuns"
                      label="Pilih Tahun"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedKegiatanId"
                      :items="kegiatansByTahun"
                      item-text="kegiatan"
                      item-value="id"
                      label="Pilih Kegiatan"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      :disabled="disableLihatFile"
                      color="primary"
                      block
                      v-on:click="lihatFile"
                    >
                      Lihat File
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="showFile">
            <v-expansion-panel-header>
              <span class="text-h6">File</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12" md="2">
                    <v-dialog
                      v-model="dialogTambahFolder"
                      persistent
                      max-width="600px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          tile
                          outlined
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          >+ Folder</v-btn
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h6">Tambah Folder</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row align="center">
                              <v-col cols="12">
                                <v-text-field
                                  v-model="dataTambahFolder.judul"
                                  label="Nama Folder"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="error"
                            text
                            v-on:click="dialogTambahFolder = false"
                          >
                            Batal
                          </v-btn>
                          <v-btn color="primary" text v-on:click="tambahFolder">
                            Simpan
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      v-model="dialogTambahFile"
                      persistent
                      max-width="600px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          tile
                          outlined
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          >+ File</v-btn
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h6">Tambah File</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row align="center">
                              <v-col cols="12">
                                <v-text-field
                                  v-model="dataTambahFile.judul"
                                  label="Nama File"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-file-input
                                  chips
                                  multiple
                                  show-size
                                  v-model="dataTambahFile.file"
                                  label="Input File"
                                ></v-file-input>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="error"
                            text
                            v-on:click="dialogTambahFile = false"
                          >
                            Batal
                          </v-btn>
                          <v-btn color="primary" text v-on:click="tambahFile">
                            Simpan
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      v-model="dialogUbahFile"
                      persistent
                      max-width="600px"
                    >
                      <v-card>
                        <v-card-title>
                          <span class="text-h6">Ubah File</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row align="center">
                              <v-col cols="12">
                                <v-text-field
                                  v-model="dataUbahFile.judul"
                                  label="Nama File"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="error"
                            text
                            v-on:click="dialogUbahFile = false"
                          >
                            Batal
                          </v-btn>
                          <v-btn color="primary" text v-on:click="ubahFile">
                            Ubah
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      v-model="dialogHapusFile"
                      persistent
                      max-width="400px"
                    >
                      <v-card>
                        <v-card-title>
                          <span class="text-h6">Hapus File</span>
                        </v-card-title>
                        <v-card-text>
                          <span class="text-subtitle-2">
                            Apakah Anda ingin menghapus File ini?
                          </span>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="error"
                            text
                            v-on:click="dialogHapusFile = false"
                          >
                            Batal
                          </v-btn>
                          <v-btn color="primary" text v-on:click="hapusFile">
                            Hapus
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" md="10">
                    <v-breadcrumbs :items="pathBreadcumbs">
                      <template v-slot:divider>
                        <v-icon>mdi-chevron-right</v-icon>
                      </template>
                      <template v-slot:item="{ item }">
                        <v-breadcrumbs-item
                          :disabled="item.disabled"
                          v-on:click="openPath(item)"
                        >
                          <span v-if="item.icon">
                            <v-icon>mdi-home</v-icon>
                          </span>
                          <span v-else>{{ item.text }} </span>
                        </v-breadcrumbs-item>
                      </template>
                    </v-breadcrumbs>
                  </v-col>
                  <v-col cols="12" md="4" v-for="(v, i) in files" :key="i">
                    <v-card v-if="v.show" class="mx-auto my-2" max-width="512">
                      <v-card-title>
                        <span class="text-subtitle-2"
                          ><span class="cyan--text">[{{ v.ekstensi }}]</span>
                          {{ v.judul }}</span
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                          v-if="v.editable"
                          tile
                          depressed
                          color="orange"
                          dark
                          v-on:click="showDialogUbahFile(v)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          v-if="v.editable"
                          tile
                          depressed
                          color="red"
                          dark
                          v-on:click="showDialogHapusFile(v)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-card-title>
                      <v-card-text>
                        <v-img
                          :src="v.sumber_gambar"
                          height="250"
                          width="500"
                          contain
                          class="mx-auto"
                          v-on:click="openFile(v)"
                        >
                        </v-img>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
  name: "Home",
  data: function () {
    return {
      token: "",
      user: {},
      password: "",
      panel: 0,
      showPanel: false,
      showPassword: false,
      showFile: false,
      selectedFungsiId: "",
      selectedKegiatanId: "",
      selectedTahun: "",
      fungsis: [],
      kegiatans: [],
      kegiatansByTahun: [],
      tahuns: [],
      files: [],
      dialogUbahPassword: false,
      dialogTambahFolder: false,
      dialogTambahFile: false,
      dialogUbahFile: false,
      dialogHapusFile: false,
      dataTambahFolder: {
        judul: "",
      },
      dataTambahFile: {
        judul: "",
        file: [],
      },
      dataUbahFile: {},
      dataHapusFile: {},
      path: "",
      pathBreadcumbs: [],
      snackbar: false,
      snackbarText: "",
      overlay: false,
    };
  },
  computed: {
    disableLihatFile: function () {
      if (this.selectedKegiatanId != "") {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    selectedFungsiId: async function (val) {
      this.showFile = false;
      this.selectedKegiatanId = "";
      this.selectedTahun = "";
      this.kegiatans = [];
      this.kegiatansByTahun = [];
      const kegiatanRequest = await this.getData(
        "/kegiatan/get/" + val,
        this.token
      );
      this.kegiatans = await kegiatanRequest.json();
      var tahuns = this.kegiatans.map(function (k) {
        return k.tahun;
      });
      this.tahuns = tahuns.filter(function (v, i, t) {
        return t.indexOf(v) === i;
      });
    },
    selectedKegiatanId: function () {
      this.showFile = false;
    },
    selectedTahun: function (val) {
      this.showFile = false;
      this.kegiatansByTahun = this.kegiatans.filter(function (k) {
        return k.tahun == val;
      });
    },
    path: function (val) {
      const pathSplit = val.split("/");
      this.pathBreadcumbs = pathSplit.map(function (p, i) {
        const text = p;
        const icon = i == 0 ? true : false;
        const disabled = pathSplit.length == i + 1 ? true : false;
        return {
          text: text,
          icon: icon,
          disabled: disabled,
          path: pathSplit.slice(0, i + 1).join("/"),
        };
      });
    },
  },
  created: async function () {
    this.token = localStorage.token;
    const userRequest = await this.getData("/auth/me", this.token);
    if (userRequest.status != 200) {
      this.$router.push("/login");
    } else {
      this.showPanel = true;
      this.user = await userRequest.json();
      const fungsiRequest = await this.getData("/fungsi/get", this.token);
      this.fungsis = await fungsiRequest.json();
      this.path = ".";
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
    lihatFile: async function () {
      this.overlay = true;
      var fileData = new FormData();
      fileData.append("kegiatan_id", this.selectedKegiatanId);
      fileData.append("path", this.path);
      const fileRequest = await this.postData(
        "/file/get",
        fileData,
        this.token
      );
      var files = await fileRequest.json();
      const url = this.$url;
      files = files.map(function (f) {
        var folder = f.folder == "1" ? true : false;
        if (folder) {
          return {
            ...f,
            folder: folder,
            ekstensi: "FOLDER",
            sumber: "",
            sumber_gambar: url + "/" + "/folder.png",
          };
        } else {
          var ekstensi = f.lokasi
            .split(".")
            [f.lokasi.split(".").length - 1].toUpperCase();
          if (["jpg", "jpeg", "png"].includes(ekstensi.toLowerCase())) {
            return {
              ...f,
              folder: folder,
              ekstensi: ekstensi,
              sumber: url + "/" + f.lokasi,
              sumber_gambar: url + "/" + f.lokasi,
            };
          } else {
            return {
              ...f,
              folder: folder,
              ekstensi: ekstensi,
              sumber: url + "/" + f.lokasi,
              sumber_gambar: url + "/file.png",
            };
          }
        }
      });
      const user = this.user;
      files = files.map(function (f) {
        if (user.level == 1 || f.user_id == user.id) {
          return {
            ...f,
            editable: true,
          };
        } else {
          return {
            ...f,
            editable: false,
          };
        }
      });
      files = files.map(function (f) {
        if (user.level != 3 || f.user_id == user.id || f.folder) {
          return {
            ...f,
            show: true,
          };
        } else {
          return {
            ...f,
            show: false,
          };
        }
      });
      files = files.sort(function (a, b) {
        const aFolder = a.folder ? "a" : "b";
        const bFolder = b.folder ? "a" : "b";
        const aJudul = aFolder + a.judul;
        const bJudul = bFolder + b.judul;
        if (aJudul < bJudul) {
          return -1;
        } else if (aJudul > bJudul) {
          return 1;
        } else {
          return 0;
        }
      });
      this.files = files;
      this.overlay = false;
      this.showFile = true;
      this.panel = 1;
    },
    tambahFolder: async function () {
      this.overlay = true;
      var tambahData = new FormData();
      tambahData.append("judul", this.dataTambahFolder.judul);
      tambahData.append("path", this.path);
      tambahData.append("folder", "1");
      tambahData.append("kegiatan_id", this.selectedKegiatanId);
      tambahData.append("user_id", this.user.id);
      const tambahFolderRequest = await this.postData(
        "/file/insert",
        tambahData,
        this.token
      );
      this.dialogTambahFolder = false;
      this.dataTambahFolder = {
        judul: "",
      };
      if (tambahFolderRequest.status != 200) {
        this.overlay = false;
        this.snackbarText = "Data tidak berhasil diubah";
        this.snackbar = true;
      } else {
        this.overlay = false;
        const tambahFolderResponse = await tambahFolderRequest.json();
        this.snackbarText = tambahFolderResponse.pesan;
        this.snackbar = true;
        this.lihatFile();
      }
    },
    tambahFile: async function () {
      this.overlay = true;
      var tambahFileRequestPromises = [];
      for (var i = 0; i < this.dataTambahFile.file.length; i++) {
        var tambahData = new FormData();
        tambahData.append("judul", this.dataTambahFile.judul);
        tambahData.append("path", this.path);
        tambahData.append("folder", "0");
        tambahData.append("file", this.dataTambahFile.file[i]);
        tambahData.append(
          "ekstensi",
          this.dataTambahFile.file[i].name.split(".")[
            this.dataTambahFile.file[i].name.split(".").length - 1
          ]
        );
        tambahData.append("kegiatan_id", this.selectedKegiatanId);
        tambahData.append("user_id", this.user.id);
        tambahFileRequestPromises.push(
          this.postData("/file/insert", tambahData, this.token)
        );
      }
      this.dialogTambahFile = false;
      const tambahFileRequests = await Promise.all(tambahFileRequestPromises);
      if (tambahFileRequests) {
        if (
          tambahFileRequests.every(function (r) {
            return r.status != 200;
          })
        ) {
          this.overlay = false;
          this.snackbarText = "Data tidak berhasil ditambahkan";
          this.snackbar = true;
        } else if (
          tambahFileRequests.every(function (r) {
            return r.status == 200;
          })
        ) {
          this.overlay = false;
          this.snackbarText = "Data berhasil ditambahkan";
          this.snackbar = true;
        } else {
          this.overlay = false;
          this.snackbarText = "Data berhasil ditambahkan sebagian";
          this.snackbar = true;
        }
        this.dataTambahFile = {
          judul: "",
          file: [],
        };
        this.lihatFile();
      }
    },
    openPath: function (v) {
      console.log(v.path);
      this.path = v.path;
      this.lihatFile();
    },
    openFile: function (v) {
      if (v.folder) {
        this.path = v.path + "/" + v.judul;
        this.lihatFile();
      } else {
        window.open(v.sumber, "_blank").focus();
      }
    },
    showDialogUbahFile: function (v) {
      this.dataUbahFile = v;
      this.dialogUbahFile = true;
    },
    ubahFile: async function () {
      this.overlay = true;
      var ubahData = new FormData();
      ubahData.append("id", this.dataUbahFile.id);
      ubahData.append("judul", this.dataUbahFile.judul);
      const ubahFileRequest = await this.postData(
        "/file/edit",
        ubahData,
        this.token
      );
      this.dialogUbahFile = false;
      this.dataUbahFile = {};
      if (ubahFileRequest.status != 200) {
        this.overlay = false;
        this.snackbarText = "Data tidak berhasil diubah";
        this.snackbar = true;
      } else {
        this.overlay = false;
        const ubahFileResponse = await ubahFileRequest.json();
        this.snackbarText = ubahFileResponse.pesan;
        this.snackbar = true;
        this.lihatFile();
      }
    },
    showDialogHapusFile: function (v) {
      this.dataHapusFile = v;
      this.dialogHapusFile = true;
    },
    hapusFile: async function () {
      this.overlay = true;
      var hapusData = new FormData();
      hapusData.append("id", this.dataHapusFile.id);
      const hapusFileRequest = await this.postData(
        "/file/delete",
        hapusData,
        this.token
      );
      this.dialogHapusFile = false;
      this.dataHapusFile = {};
      if (hapusFileRequest.status != 200) {
        this.overlay = false;
        this.snackbarText = "Data tidak berhasil dihapus";
        this.snackbar = true;
      } else {
        this.overlay = false;
        const hapusFileResponse = await hapusFileRequest.json();
        this.snackbarText = hapusFileResponse.pesan;
        this.snackbar = true;
        this.lihatFile();
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
      this.password = "";
      if (passwordRequest.status != 200) {
        this.snackbarText = "Password tidak berhasil diubah";
        this.snackbar = true;
      } else {
        const passwordResponse = await passwordRequest.json();
        this.snackbarText = passwordResponse.pesan;
        this.snackbar = true;
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
